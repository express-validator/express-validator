/*
 * This binds the node-validator library to the req object so that
 * the validation / sanitization methods can be called on parameter
 * names rather than the actual strings.
 *
 *
 * 1. To validate parameters, use `req.check(param_name, [err_message])`
 *        e.g. req.check('param1').len(1, 6).isInt();
 *        e.g. req.checkHeader('referer').contains('mydomain.com');
 *
 *    Each call to `check()` will throw an exception by default. To
 *    specify a custom err handler, use `req.onValidationError(errback)`
 *    where errback receives a parameter containing the error message
 *
 * 2. To sanitize parameters, use `req.sanitize(param_name)`
 *        e.g. req.sanitize('param1').toBoolean();
 *        e.g. req.sanitize('param2').toInt();
 *
 * 3. Done! Access your validated and sanitized paramaters through the
 *    `req.params` object
 */

var validator = require('validator');

var expressValidator = function(options) {
  options = options || {};

  var _options = {};

  _options.customValidators = options.customValidators || {};

  _options.errorFormatter = options.errorFormatter || function(param, msg, value) {
    return {
      param : param,
      msg   : msg,
      value : value
    };
  };

  var sanitizers = ['trim', 'ltrim', 'rtrim', 'escape', 'stripLow', 'whitelist',
  'blacklist', 'normalizeEmail'];

  var sanitize = function(request, param, value) {
    var methods = {};

    Object.keys(validator).forEach(function(methodName) {
      if (methodName.match(/^to/) || sanitizers.indexOf(methodName) !== -1) {
        methods[methodName] = function() {
          var args = [value].concat(Array.prototype.slice.call(arguments));
          var result = validator[methodName].apply(validator, args);
          request.updateParam(param, result);
          return result;
        }
      }
    });

    return methods;
  }

  function checkParam(req, getter) {
    return function(param, failMsg) {

      var value;

      // If param is not an array, then split by dot notation
      // returning an array. It will return an array even if
      // param doesn't have the dot notation.
      //      'blogpost' = ['blogpost']
      //      'login.username' = ['login', 'username']
      // For regex matches you can access the parameters using numbers.
      if (!Array.isArray(param)) {
        param = typeof param === 'number' ?
          [param] :
          param.split('.').filter(function(e){
            return e !== '';
          });
      }

      // Extract value from params
      param.map(function(item) {
        if (value === undefined) {
          value = getter(item)
        } else {
          value = value[item];
        }
      });
      param = param.join('.');

      var errorHandler = function(msg) {
        var error = _options.errorFormatter(param, msg, value);

        if (req._validationErrors === undefined) {
          req._validationErrors = [];
        }
        req._validationErrors.push(error);

        if (req.onErrorCallback) {
          req.onErrorCallback(msg);
        }
        return this;
      }

      var methods = [];

      Object.keys(validator).forEach(function(methodName) {
        if (!methodName.match(/^to/) && sanitizers.indexOf(methodName) === -1) {
          methods[methodName] = function() {
            var args = [value].concat(Array.prototype.slice.call(arguments));
            var isCorrect = validator[methodName].apply(validator, args);

            if (!isCorrect) {
              errorHandler(failMsg || 'Invalid value');
            }

            return methods;
          }
        }
      });

      Object.keys(_options.customValidators).forEach(function(customName) {
        methods[customName] = function() {
          var args = [value].concat(Array.prototype.slice.call(arguments));
          var isCorrect = _options.customValidators[customName].apply(null, args);

          if (!isCorrect) {
            errorHandler(failMsg || 'Invalid value');
          }

          return methods;
        };
      });

      methods['notEmpty'] = function() {
        return methods.isLength(1);
      }

      methods['len'] = function() {
        return methods.isLength.apply(methods.isLength, Array.prototype.slice.call(arguments));
      }

      methods['optional'] = function() {
        if (value !== undefined) {
          return methods;
        }

        var dummyMethods = [];
        for (var methodName in methods) {
          dummyMethods[methodName] = function() { return dummyMethods; };
        }
        return dummyMethods;
      };

      return methods;
    }
  }
  return function(req, res, next) {

    req.updateParam = function(name, value) {
      // route params like /user/:id
      if (this.params && this.params.hasOwnProperty(name) &&
        undefined !== this.params[name]) {
        return this.params[name] = value;
      }
      // query string params
      if (undefined !== this.query[name]) {
        return this.query[name] = value;
      }
      // request body params via connect.bodyParser
      if (this.body && undefined !== this.body[name]) {
        return this.body[name] = value;
      }
      return false;
    };

    req.check = checkParam(req, function(item) {
      return req.param(item);
    });

    req.checkFiles = checkParam(req, function(item) {
      return req.files && req.files[item];
    });

    req.checkBody = checkParam(req, function(item) {
      return req.body && req.body[item];
    });

    req.checkParams = checkParam(req, function(item) {
      return req.params && req.params[item];
    });

    req.checkQuery = checkParam(req, function(item) {
      return req.query && req.query[item];
    });

    req.checkHeader = checkParam(req, function(header) {
      var toCheck;

      if (header === 'referrer' || header === 'referer') {
        toCheck = req.headers.referer;
      } else {
        toCheck = req.headers[header];
      }
      return toCheck || '';
    });

    req.onValidationError = function(errback) {
      req.onErrorCallback = errback;
    };

    req.validationErrors = function(mapped) {
      if (req._validationErrors === undefined) {
        return null;
      }
      if (mapped) {
        var errors = {};
        req._validationErrors.forEach(function(err) {
          errors[err.param] = err;
        });
        return errors;
      }
      return req._validationErrors;
    }

    req.filter = function(param) {
      return sanitize(this, param, this.param(param));
    };

    // Create some aliases - might help with code readability
    req.sanitize = req.filter;
    req.assert = req.check;
    req.validate = req.check;

    return next();
  };
}
module.exports = expressValidator;
module.exports.validator = validator;
