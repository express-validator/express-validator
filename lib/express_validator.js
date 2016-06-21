var validator = require('validator');
var _ = require('lodash');
var Promise = require('bluebird');

// When validator upgraded to v5, they removed automatic string coercion
// The next few methods (up to validator.init()) restores that functionality
// so that express-validator can continue to function normally
validator.extend = function(name, fn) {
  validator[name] = function() {
    var args = Array.prototype.slice.call(arguments);
    args[0] = validator.toString(args[0]);
    return fn.apply(validator, args);
  };
};

validator.init = function() {
  for (var name in validator) {
  if (typeof validator[name] !== 'function' || name === 'toString' ||
    name === 'toDate' || name === 'extend' || name === 'init' ||
    name === 'isServerSide') {
      continue;
  }
  validator.extend(name, validator[name]);
  }
};

validator.toString = function(input) {
  if (typeof input === 'object' && input !== null && input.toString) {
    input = input.toString();
  } else if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
    input = '';
  }
  return '' + input;
};

validator.toDate = function(date) {
  if (Object.prototype.toString.call(date) === '[object Date]') {
    return date;
  }
  date = Date.parse(date);
  return !isNaN(date) ? new Date(date) : null;
};

validator.init();

// validators and sanitizers not prefixed with is/to
var additionalValidators = ['contains', 'equals', 'matches'];
var additionalSanitizers = ['trim', 'ltrim', 'rtrim', 'escape', 'stripLow', 'whitelist', 'blacklist', 'normalizeEmail'];

/**
 * Initializes a chain of validators
 *
 * @class
 * @param  {(string|string[])}  param         path to property to validate
 * @param  {string}             failMsg       validation failure message
 * @param  {Request}            req           request to attach validation errors
 * @param  {string}             location      request property to find value (body, params, query, etc.)
 * @param  {object}             options       options containing error formatter
 */

function ValidatorChain(param, failMsg, req, location, options) {
  this.errorFormatter = options.errorFormatter;
  this.param = param;
  this.value = location ? _.get(req[location], param) : undefined;
  this.validationErrors = [];
  this.failMsg = failMsg;
  this.req = req;
  this.lastError = null; // used by withMessage to get the values of the last error
  return this;
}


/**
 * Initializes a sanitizer
 *
 * @class
 * @param  {(string|string[])}  param    path to property to sanitize
 * @param  {[type]}             req             request to sanitize
 * @param  {[type]}             location        request property to find value
 */

function Sanitizer(param, req, locations) {
  this.values = locations.map(function(location) {
    return _.get(req[location], param);
  });

  this.req = req;
  this.param = param;
  this.locations = locations;
  return this;
}

/**
 * Adds validation methods to request object via express middleware
 *
 * @method expressValidator
 * @param  {object}         options
 * @return {function}       middleware
 */

var expressValidator = function(options) {
  options = options || {};
  var defaults = {
    customValidators: {},
    customSanitizers: {},
    errorFormatter: function(param, msg, value) {
      return {
        param: param,
        msg: msg,
        value: value
      };
    }
  };

  _.defaults(options, defaults);

  // _.set validators and sanitizers as prototype methods on corresponding chains
  _.forEach(validator, function(method, methodName) {
    if (methodName.match(/^is/) || _.includes(additionalValidators, methodName)) {
      ValidatorChain.prototype[methodName] = makeValidator(methodName, validator);
    }

    if (methodName.match(/^to/) || _.includes(additionalSanitizers, methodName)) {
      Sanitizer.prototype[methodName] = makeSanitizer(methodName, validator);
    }
  });

  ValidatorChain.prototype.notEmpty = function() {
    return this.isLength({
      min: 1
    });
  };

  ValidatorChain.prototype.len = function() {
    return this.isLength.apply(this, arguments);
  };

  ValidatorChain.prototype.optional = function(opts) {
    opts = opts || {};
    // By default, optional checks if the key exists, but the user can pass in
    // checkFalsy: true to skip validation if the property is falsy
    var defaults = {
      checkFalsy: false
    };

    var options = _.assign(defaults, opts);

    if (options.checkFalsy) {
      if (!this.value) {
        this.skipValidating = true;
      }
    } else {
      if (this.value === undefined) {
        this.skipValidating = true;
      }
    }

    return this;
  };

  ValidatorChain.prototype.withMessage = function(message) {
    if (this.lastError) {
        if (this.lastError.isAsync) {
            this.req._asyncValidationErrors.pop().catch(function() {
              // Suppress errors from original promise - they should go to the new one.
              // Otherwise bluebird throws an 'unhandled rejection' error
            });
            var error = formatErrors.call(this.lastError.context, this.lastError.param, message, this.lastError.value);
            var promise = this.lastError.promise.catch(function() {
                return Promise.reject(error);
            });
            this.req._asyncValidationErrors.push(promise);
        } else {
            this.validationErrors.pop();
            this.req._validationErrors.pop();
            var errorMessage = formatErrors.call(this, this.lastError.param, message, this.lastError.value);
            this.validationErrors.push(errorMessage);
            this.req._validationErrors.push(errorMessage);
            this.lastError = null;
        }
    }
    return this;
  };

  _.forEach(options.customValidators, function(method, customValidatorName) {
    ValidatorChain.prototype[customValidatorName] = makeValidator(customValidatorName, options.customValidators);
  });

  _.forEach(options.customSanitizers, function(method, customSanitizerName) {
    Sanitizer.prototype[customSanitizerName] = makeSanitizer(customSanitizerName, options.customSanitizers);
  });

  return function(req, res, next) {
    var locations = ['body', 'params', 'query'];

    req._validationErrors = [];
    req._asyncValidationErrors = [];
    req.validationErrors = function(mapped, promisesResolved) {
      if (!promisesResolved && req._asyncValidationErrors.length > 0) {
        console.warn('WARNING: You have asynchronous validators but you have not used asyncValidateErrors to check for errors.');
      }

      if (mapped && req._validationErrors.length > 0) {
        var errors = {};
        req._validationErrors.forEach(function(err) {
          errors[err.param] = err;
        });

        return errors;
      }

      return req._validationErrors.length > 0 ? req._validationErrors : false;
    };

    req.asyncValidationErrors = function(mapped) {
      return new Promise(function(resolve, reject) {
        var promises = req._asyncValidationErrors;
        // Migrated using the recommended fix from
        // http://bluebirdjs.com/docs/api/reflect.html
        Promise.all(promises.map(function(promise) {
          // Must convert to Bluebird promise in case they are using native
          // Node promises since reflect() is not a native promise method
          // http://bluebirdjs.com/docs/api/reflect.html#comment-2369616577
          return Promise.resolve(promise).reflect();
        })).then(function(results) {

          results.forEach(function(result) {
            if (result.isRejected()) {
              req._validationErrors.push(result.reason());
            }
          });

          if (req._validationErrors.length > 0) {
            return reject(req.validationErrors(mapped, true));
          }
          resolve();
        });
      });
    };

    locations.forEach(function(location) {
      req['sanitize' + _.capitalize(location)] = function(param) {
        return new Sanitizer(param, req, [location]);
      };
    });

    req.sanitizeHeaders = function(param) {
      if (param === 'referrer') {
        param = 'referer';
      }

      return new Sanitizer(param, req, ['headers']);
    };

    req.sanitize = function(param) {
      return new Sanitizer(param, req, locations);
    };

    locations.forEach(function(location) {
      req['check' + _.capitalize(location)] = function(param, failMsg) {
        if (_.isPlainObject(param)) {
          return validateSchema(param, req, location, options);
        }
        return new ValidatorChain(param, failMsg, req, location, options);
      };
    });

    req.checkFiles = function(param, failMsg) {
      return new ValidatorChain(param, failMsg, req, 'files', options);
    };

    req.checkHeaders = function(param, failMsg) {
      if (param === 'referrer') {
        param = 'referer';
      }

      return new ValidatorChain(param, failMsg, req, 'headers', options);
    };

    req.check = function(param, failMsg) {
      if (_.isPlainObject(param)) {
        return validateSchema(param, req, 'any', options);
      }
      return new ValidatorChain(param, failMsg, req, locate(req, param), options);
    };

    req.filter = req.sanitize;
    req.assert = req.check;
    req.validate = req.check;

    next();
  };
};

/**
 * validate an object using a schema, using following format:
 *
 * {
 *   paramName: {
 *     validatorName: true,
 *     validator2Name: true
 *   }
 * }
 *
 * Pass options or a custom error message:
 *
 * {
 *   paramName: {
 *     validatorName: {
 *       options: ['', ''],
 *       errorMessage: 'An Error Message'
 *     }
 *   }
 * }
 *
 * @method validateSchema
 * @param  {Object}       schema    schema of validations
 * @param  {Request}      req       request to attach validation errors
 * @param  {string}       location  request property to find value (body, params, query, etc.)
 * @param  {Object}       options   options containing custom validators & errorFormatter
 * @return {object[]}               array of errors
 */

function validateSchema(schema, req, loc, options) {
  var locations = ['body', 'params', 'query'],
    currentLoc = loc;

  for (var param in schema) {

    // check if schema has defined location
    if (schema[param].hasOwnProperty('in')) {
      if (locations.indexOf(schema[param].in) !== -1) {
        currentLoc = schema[param].in;
      } else {
        // skip params where defined location is not supported
        continue;
      }
    }

    currentLoc = currentLoc === 'any' ? locate(req, param) : currentLoc;
    var validator = new ValidatorChain(param, null, req, currentLoc, options);
    var paramErrorMessage = schema[param].errorMessage;

    for (var methodName in schema[param]) {
      if (methodName === 'in') {
        /* Skip method if this is location definition, do not validate it.
         * Restore also the original location that was changed only for this particular param.
         * Without it everything after param with in field would be validated against wrong location.
         */
        currentLoc = loc;
        continue;
      }

      if (methodName === 'errorMessage') {
        /**
         * Also do not validate if methodName
         * represent parameter error mesage
         */
        continue;
      }

      validator.failMsg = schema[param][methodName].errorMessage || paramErrorMessage || 'Invalid param';
      validator[methodName].apply(validator, schema[param][methodName].options);
    }
  }
}

/**
 * Validates and handles errors, return instance of itself to allow for chaining
 *
 * @method makeValidator
 * @param  {string}          methodName
 * @param  {object}          container
 * @return {function}
 */

function makeValidator(methodName, container) {
  return function() {
    if (this.skipValidating) {
      return this;
    }

    var args = [];
    args.push(this.value);
    args = args.concat(Array.prototype.slice.call(arguments));

    var isValid = container[methodName].apply(container, args);
    var error = formatErrors.call(this, this.param, this.failMsg || 'Invalid value', this.value);

    if (isValid.then) {
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

function makeSanitizer(methodName, container) {
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

function locate(req, name) {
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
function formatErrors(param, msg, value) {
  var formattedParam = formatParamOutput(param);

  return this.errorFormatter(formattedParam, msg, value);
}

// Convert nested params as array into string for output
// Ex: ['users', '0', 'fields', 'email'] to 'users[0].fields.email'
function formatParamOutput(param) {
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
}

module.exports = expressValidator;
module.exports.validator = validator;
module.exports.utils = {
  formatParamOutput: formatParamOutput
};
