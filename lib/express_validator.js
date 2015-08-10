var validator = require('validator');
var _ = require('lodash');

// validators and sanitizers not prefixed with is/to
var additionalValidators = ['contains', 'equals', 'matches'];
var additionalSanitizers = ['trim', 'ltrim', 'rtrim', 'escape', 'stripLow', 'whitelist', 'blacklist', 'normalizeEmail'];

/**
 * Initalizes a chain of validators
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

  return this;
}


/**
 * Initializes a  sanitizers
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

  // _.set validators and sainitizers as prototype methods on corresponding chains
  _.forEach(validator, function(method, methodName) {
    if (methodName.match(/^is/) || _.contains(additionalValidators, methodName)) {
      ValidatorChain.prototype[methodName] = makeValidator(methodName, validator);
    }

    if (methodName.match(/^to/) || _.contains(additionalSanitizers, methodName)) {
      Sanitizer.prototype[methodName] = makeSanitizer(methodName, validator);
    }
  });

  ValidatorChain.prototype.notEmpty = function() {
    return this.isLength(1);
  };

  ValidatorChain.prototype.len = function() {
    return this.isLength.apply(this, arguments);
  };

  ValidatorChain.prototype.optional = function() {
    if (this.value === undefined) {
      this.skipValidating = true;
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
    req.validationErrors = function(mapped) {
      if (mapped && req._validationErrors.length > 0) {
        var errors = {};
        req._validationErrors.forEach(function(err) {
          errors[err.param] = err;
        });

        return errors;
      }

      return req._validationErrors.length > 0 ? req._validationErrors : false;
    };

    locations.forEach(function(location) {
      req['sanitize' + _.capitalize(location)] = function(param) {
        return new Sanitizer(param, req, [location]);
      };
    });

    req.sanitize = function(param) {
      return new Sanitizer(param, req, locations);
    };

    locations.forEach(function(location) {
      req['check' + _.capitalize(location)] = function(param, failMsg) {
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
      return new ValidatorChain(param, failMsg, req, locate(req, param), options);
    };

    req.filter = req.sanitize;
    req.assert = req.check;
    req.validate = req.check;

    next();
  };
};

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
    if (!isValid) {
      var error = this.errorFormatter(this.param, this.failMsg || 'Invalid value', this.value);
      this.validationErrors.push(error);
      this.req._validationErrors.push(error);
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

module.exports = expressValidator;
module.exports.validator = validator;
