var deprecate = require('util').deprecate;
var validator = require('validator');
var _ = require('lodash');
var utils = require('./utils');
var check = require('../check/check');
var selectFields = require('../check/select-fields');
var validationResult = require('../check/validation-result');

var validatorChainSymbol = Symbol('express-validator.validatorChain');
var sanitizerSymbol = Symbol('express-validator.sanitizer');

// Because req.validationErrors and req.asyncValidationErrors are build dynamically,
// these warnings would appear everytime a new request comes in.
// Therefore the best solution to show the warning is to create a stub function,
// and invoke it inside the deprecated functions.
var warnValidationErrors = deprecate(
  function () {},
  'req.validationErrors() may be removed in a future version. Use req.getValidationResult() instead.'
);

var warnAsyncValidationErrors = deprecate(
  function () {},
  'req.asyncValidationErrors() may be removed in a future version. Use req.getValidationResult() instead.'
);

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
var additionalSanitizers = ['trim', 'ltrim', 'rtrim', 'escape', 'unescape', 'stripLow', 'whitelist', 'blacklist', 'normalizeEmail'];

var allLocations = ['params', 'query', 'body', 'headers', 'cookies'];

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
    errorFormatter: function(param, msg, value, location) {
      return {
        location,
        param: param,
        msg: msg,
        value: value
      };
    }
  };

  _.defaults(options, defaults);

  /**
   * Initializes a sanitizer
   *
   * @class
   * @param  {(string|string[])}  param    path to property to sanitize
   * @param  {[type]}             req             request to sanitize
   * @param  {[string]}           locations        request property to find value
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

  function createValidationChain(field, location, message, req, contexts) {
    const chain = check([field], Array.isArray(location) ? location : [location], message);
    contexts.push(chain._context);

    chain.notEmpty = () => chain.isLength({ min: 1 });
    chain.len = chain.isLength;

    req[validatorChainSymbol].forEach(customValidators => {
      Object.keys(customValidators).forEach(name => {
        chain[name] = (...options) => {
          chain._context.validators.push({
            options,
            negated: chain._context.negateNext,
            validator: customValidators[name]
          });
          chain._context.negateNext = false;
          return chain;
        };
      });
    });

    return chain;
  }

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
   * @param  {string}       loc  request property to find value (body, params, query, etc.)
   * @return {object[]}               array of errors
   */

  function validateSchema(schema, req, loc, contexts) {
    var currentLoc = loc;

    for (var param in schema) {
      const paramCfg = schema[param];

      // check if schema has defined location
      if (paramCfg.hasOwnProperty('in')) {
        if (allLocations.indexOf(paramCfg.in) !== -1) {
          currentLoc = paramCfg.in;
        } else {
          // skip params where defined location is not supported
          continue;
        }
      } else {
        currentLoc = loc === 'any' ? allLocations : currentLoc;
      }

      const paramErrorMessage = paramCfg.errorMessage;
      var validator = createValidationChain(param, currentLoc, paramErrorMessage, req, contexts);

      for (var methodName in paramCfg) {
        const methodCfg = paramCfg[methodName];

        if (methodName === 'in') {
          /* Skip method if this is location definition, do not validate it.
          * Restore also the original location that was changed only for this particular param.
          * Without it everything after param with in field would be validated against wrong location.
          */
          currentLoc = loc;
          continue;
        }

        if (methodName === 'errorMessage' || !methodCfg) {
          // Also do not validate if methodName represent parameter error message
          // or if the value is falsy
          continue;
        }

        let opts = methodCfg.options || [];
        if (opts != null && !Array.isArray(opts)) {
          opts = [opts];
        }

        validator[methodName](...opts);
        methodName !== 'optional' && validator.withMessage(methodCfg.errorMessage);
      }
    }
  }

  /**
   * Error formatter delegator to the legacy format
   * @param {*} error
   */
  function errorFormatter({ param, msg, value, location }) {
    return options.errorFormatter(param, msg, value, location);
  }

  // _.set sanitizers as prototype methods on corresponding chains
  _.forEach(validator, function(method, methodName) {
    if (methodName.match(/^to/) || _.includes(additionalSanitizers, methodName)) {
      Sanitizer.prototype[methodName] = utils.makeSanitizer(methodName, validator);
    }
  });

  utils.mapAndExtend(options.customSanitizers, Sanitizer.prototype, utils.makeSanitizer);

  return function(req, res, next) {
    const contexts = [];
    function runContexts() {
      contexts.filter(context => !context.promise).forEach(context => {
        const field = selectFields(req, context)[0];
        if (!field) {
          context.promise = Promise.resolve();
          return;
        }

        const promises = context.validators.map(validatorCfg => {
          const result = validatorCfg.validator(field.value, ...validatorCfg.options);
          const errorObj = {
            location: field.location,
            value: field.value,
            param: utils.formatParamOutput(field.path),
            msg: utils.replaceArgs(
              validatorCfg.message || context.message || 'Invalid value',
              [field.value, ...validatorCfg.options]
            )
          };

          if (result && result.then) {
            req._asyncValidationErrors.push(result.then(() => {
              validatorCfg.negated && req._validationErrors.push(errorObj);
            }, () => {
              !validatorCfg.negated && req._validationErrors.push(errorObj);
            }));
          } else if ((!validatorCfg.negated && !result) || (validatorCfg.negated && result)) {
            req._validationErrors.push(errorObj);
          }
        });

        context.promise = Promise.all(promises);
      });
    }

    var locations = ['body', 'params', 'query', 'cookies'];

    // Extend existing validators. Fixes bug #341
    req[validatorChainSymbol] = req[validatorChainSymbol] || [];
    req[validatorChainSymbol].push(options.customValidators);

    // Extend existing sanitizer. Fixes bug #341
    if (req[sanitizerSymbol] && req[sanitizerSymbol] !== Sanitizer) {
      Sanitizer = req[sanitizerSymbol];
      utils.mapAndExtend(options.customSanitizers, Sanitizer.prototype, utils.makeSanitizer);
    }
    req[sanitizerSymbol] = Sanitizer;

    req._validationErrors = [];
    req._asyncValidationErrors = [];
    req.validationErrors = function(mapped) {
      warnValidationErrors();
      runContexts();

      var result = validationResult(req).formatWith(errorFormatter);
      if (result.isEmpty()) {
        return false;
      }

      return mapped ? result.mapped() : result.array();
    };

    req.asyncValidationErrors = function(mapped) {
      warnAsyncValidationErrors();
      runContexts();
      return Promise.all(req._asyncValidationErrors).then(() => {
        if (req._validationErrors.length > 0) {
          return Promise.reject(req.validationErrors(mapped, true));
        }

        return Promise.resolve();
      });
    };

    req.getValidationResult = function() {
      runContexts();
      return Promise.all(req._asyncValidationErrors).then(() => {
        return validationResult(req).formatWith(errorFormatter);
      });
    };

    locations.forEach(function(location) {
      /**
       * @name req.sanitizeQuery
       * @see sanitize
       * @param param
       */
      /**
       * @name req.sanitizeParams
       * @see sanitize
       * @param param
       */
      /**
       * @name req.sanitizeBody
       * @see sanitize
       * @param param
       */
      req['sanitize' + _.capitalize(location)] = function(param) {
        return new Sanitizer(param, req, [location]);
      };
    });

    req.sanitizeHeaders = function(param) {
      if (param === 'referrer') {
        param = 'referer';
      }

      return new Sanitizer(param.toLowerCase(), req, ['headers']);
    };

    req.sanitize = function(param) {
      return new Sanitizer(param, req, locations);
    };

    locations.forEach(function(location) {
      /**
       * @name req.checkQuery
       * @see check
       * @param param
       * @param [failMsg]
       */
      /**
       * @name req.checkParams
       * @see check
       * @param param
       * @param [failMsg]
       */
      /**
       * @name req.checkBody
       * @see check
       * @param param
       * @param [failMsg]
       */
      /**
       * @name req.checkCookies
       * @see check
       * @param param
       * @param [failMsg]
       */
      req['check' + _.capitalize(location)] = function(param, failMsg) {
        if (_.isPlainObject(param)) {
          return validateSchema(param, req, location, contexts);
        }
        return createValidationChain(param, location, failMsg, req, contexts);
      };
    });

    req.checkHeaders = function(param, failMsg) {
      if (_.isPlainObject(param)) {
        return validateSchema(param, req, 'headers', contexts);
      }

      if (param === 'referrer') {
        param = 'referer';
      }

      return createValidationChain(param.toLowerCase(), 'headers', failMsg, req, contexts);
    };

    req.check = function(param, failMsg) {
      if (_.isPlainObject(param)) {
        return validateSchema(param, req, 'any', contexts);
      }
      return createValidationChain(param, allLocations, failMsg, req, contexts);
    };

    req.filter = req.sanitize;
    req.assert = req.check;
    req.validate = req.check;

    next();
  };
};

module.exports = expressValidator;
module.exports.validator = validator;
module.exports.utils = utils;
