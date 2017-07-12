var _ = require('lodash');
var validator = require('validator');

/**
 * display warnings once per each validator
 * which returns null or undefined as a validation
 * result
 */
var warnValidatorNilReturn = (function() {
  var warned = {};
  return function(methodName, returnedValue) {
    if (warned[methodName]) {
      return;
    }
    warned[methodName] = true;
    console.warn('WARNING: unexpected return value: `' + returnedValue + '` returned by `' + methodName + '` validator');
  }

}());

module.exports = exports = {};

// Convert nested params as array into string for output
// Ex: ['users', '0', 'fields', 'email'] to 'users[0].fields.email'
exports.formatParamOutput = function formatParamOutput(param) {
  if (Array.isArray(param)) {
    param = param.reduce(function(prev, curr) {
      var part = '';
      if (validator.isInt(curr)) {
        part = '[' + curr + ']';
      } else {
        if (prev) {
          part = '.' + curr;
        } else {
          part = curr;
        }
      }

      return prev + part;
    });
  }

  return param;
};

exports.mapAndExtend = function createCustomValidators(src, dest, mapFunction) {
  Object.keys(src).forEach(function (name) {
    dest[name] = mapFunction(name, src);
  });
};

/**
 * Validates and handles errors, return instance of itself to allow for chaining
 *
 * @method makeValidator
 * @param  {string}          methodName
 * @param  {object}          container
 * @return {function}
 */
exports.makeValidator = function makeValidator(methodName, container) {
  return function() {
    if (this.skipValidating) {
      return this;
    }

    var args = [];
    args.push(this.value);
    args = args.concat(Array.prototype.slice.call(arguments));

    var isValid = container[methodName].apply(container, args);

    // Perform string replacement in the error message
    var msg = this.failMsg;
    if (typeof msg === 'string') {
      args.forEach(function(arg, i) { msg = msg.replace('%' + i, arg); });
    }
    var error = exports.formatErrors.call(this, this.param, msg || 'Invalid value', this.value);

    var isNilValue = isValid === undefined || isValid === null

    if (isNilValue) {
      warnValidatorNilReturn(methodName, isValid);
    }

    if (!isNilValue && isValid.then) {
      var promise = isValid.catch(function() {
        return Promise.reject(error);
      });
      this.lastError = {
        promise: isValid,
        param: this.param,
        value: this.value,
        context: this,
        isAsync: true
      };
      this.req._asyncValidationErrors.push(promise);
    } else if (!isValid) {
      this.validationErrors.push(error);
      this.req._validationErrors.push(error);
      this.lastError = { param: this.param, value: this.value, isAsync: false };
    } else {
      this.lastError = null;
    }

    return this;
  };
}

/**
 * Sanitizes and sets sanitized value on the request, then return instance of itself to allow for chaining
 *
 * @method makeSanitizer
 * @param  {string}          methodName
 * @param  {object}          container
 * @return {function}
 */
exports.makeSanitizer = function makeSanitizer(methodName, container) {
  return function() {
    var _arguments = arguments;
    var result;
    this.values.forEach(function(value, i) {
      if (value != null) {
        var args = [value];
        args = args.concat(Array.prototype.slice.call(_arguments));
        result = container[methodName].apply(container, args);

        _.set(this.req[this.locations[i]], this.param, result);
        this.values[i] = result;
      }
    }.bind(this));

    return result;
  };
}

/**
 * find location of param
 *
 * @method param
 * @param  {Request} req       express request object
 * @param  {(string|string[])} name [description]
 * @return {string}
 */
exports.locate = function locate(req, name) {
  if (_.get(req.params, name)) {
    return 'params';
  } else if (_.has(req.query, name)) {
    return 'query';
  } else if (_.has(req.body, name)) {
    return 'body';
  }

  return undefined;
}

/**
 * format param output if passed in as array (for nested)
 * before calling errorFormatter
 *
 * @method param
 * @param  {(string|string[])} param       parameter as a string or array
 * @param  {string} msg
 * @param  {string} value
 * @return {function}
 */
exports.formatErrors = function formatErrors(param, msg, value) {
  var formattedParam = exports.formatParamOutput(param);

  return this.errorFormatter(formattedParam, msg, value);
}

exports.decorateAsValidationResult = function decorateAsValidationResult(obj, errors) {
  var onlyFirstError = false;

  obj.isEmpty = function isEmpty() {
    return !errors.length;
  };

  obj.array = function allErrors() {
    var used = {};
    return !onlyFirstError ? errors : errors.filter(function(error) {
      if (used[error.param]) {
        return false;
      }

      used[error.param] = true;
      return true;
    });
  };

  obj.mapped = function mappedErrors() {
    return errors.reduce(function(mapping, error) {
      if (!onlyFirstError || !mapping[error.param]) {
        mapping[error.param] = error;
      }

      return mapping;
    }, {});
  };

  obj.useFirstErrorOnly = function useFirstErrorOnly(flag) {
    onlyFirstError = flag === undefined || flag;
    return obj;
  };

  obj.throw = function throwError() {
    if (errors.length) {
      throw decorateAsValidationResult(new Error('Validation failed'), errors);
    }
  };

  return obj;
};