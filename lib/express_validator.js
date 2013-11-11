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
 *        e.g. req.sanitize('large_text').xss();
 *        e.g. req.sanitize('param2').toInt();
 *
 * 3. Done! Access your validated and sanitized paramaters through the
 *    `req.params` object
 */

var Validator = require('validator').Validator,
    Filter = require('validator').Filter;

var validator = new Validator();

var expressValidator = function(options) {
  options = options || {};

  var _options = {};

  _options.errorFormatter = options.errorFormatter || function(param, msg, value) {
    return {
      param : param,
      msg   : msg,
      value : value
    };
  };

  function checkParam(req, getter) {
    return function(param, fail_msg) {

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

      validator.error = function(msg) {
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
      return validator.check(value, fail_msg);
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

    req.checkBody = checkParam(req, function(item) {
      return req.body && req.body[item];
    });

    req.checkParams = checkParam(req, function(item) {
      return req.params && req.params[item];
    });

    req.checkQuery = checkParam(req, function(item) {
      return req.query && req.query[item];
    });

    req.checkHeader = function(header, fail_msg) {
      var to_check;
      if (header === 'referrer' || header === 'referer') {
        to_check = this.headers.referer;
      } else {
        to_check = this.headers[header];
      }
      return validator.check(to_check || '', fail_msg);
    };

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
      var self = this;
      var filter = new Filter();
      filter.modify = function(str) {
        this.str = str;
        // Replace the param with the filtered version
        self.updateParam(param, str);
      };
      return filter.sanitize(this.param(param));
    };

    // Create some aliases - might help with code readability
    req.sanitize = req.filter;
    req.assert = req.check;
    req.validate = req.check;

    return next();
  };
}
module.exports = expressValidator;
module.exports.Validator = Validator;
module.exports.Filter = Filter;
