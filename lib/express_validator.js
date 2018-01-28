var validator = require('validator');
var _ = require('lodash');
var utils = require('./utils');
const { checkSchema, validationResult } = require('../check');
const chainCreator = require('./chain-creator');
const getCustomMethods = require('./custom-methods');
const contextRunner = require('./legacy-runner');

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

    utils.mapAndExtend(
      getCustomMethods(req, options).sanitizers,
      Sanitizer.prototype,
      utils.makeSanitizer
    );

    return this;
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
    checkSchema(schema, loc, (field, locations, message) => chainCreator(
      field,
      locations,
      message,
      contexts,
      getCustomMethods(req, options)
    ));
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
    const runContexts = () => contextRunner(contexts, req);

    var locations = ['body', 'params', 'query', 'cookies'];

    // Extend existing validators. Fixes bug #341
    const customMethods = getCustomMethods(req, options);

    req._validationErrors = [];
    req._asyncValidationErrors = [];
    req.validationErrors = function(mapped) {
      runContexts();

      var result = validationResult(req).formatWith(errorFormatter);
      if (result.isEmpty()) {
        return false;
      }

      return mapped ? result.mapped() : result.array();
    };

    req.asyncValidationErrors = function(mapped) {
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
          return validateSchema(param, req, [location], contexts);
        }
        return chainCreator(param, location, failMsg, contexts, customMethods);
      };
    });

    req.checkHeaders = function(param, failMsg) {
      if (_.isPlainObject(param)) {
        return validateSchema(param, req, ['headers'], contexts);
      }

      if (param === 'referrer') {
        param = 'referer';
      }

      return chainCreator(param.toLowerCase(), 'headers', failMsg, contexts, customMethods);
    };

    req.check = function(param, failMsg) {
      if (_.isPlainObject(param)) {
        return validateSchema(param, req, ['params', 'query', 'body', 'headers', 'cookies'], contexts);
      }
      return chainCreator(param, allLocations, failMsg, contexts, customMethods);
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
