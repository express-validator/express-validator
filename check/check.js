const validator = require('validator');

const runner = require('./runner');
const { isSanitizer, isValidator } = require('../utils/filters');
const persistValues = require('../utils/persist-values');

module.exports = (fields, locations, message) => {
  let optional;
  const validators = [];
  const sanitizers = [];
  fields = Array.isArray(fields) ? fields : [fields];

  const middleware = (req, res, next) => {
    return runner(req, middleware._context).then(errors => {
      req._validationContexts = (req._validationContexts || []).concat(middleware._context);
      req._validationErrors = (req._validationErrors || []).concat(errors);
      persistValues(req, middleware._context);
      next();
    }, next);
  };

  Object.keys(validator)
    .filter(isValidator)
    .forEach(methodName => {
      const validationFn = validator[methodName];
      middleware[methodName] = (...options) => {
        validators.push({
          negated: middleware._context.negateNext,
          validator: validationFn,
          options
        });
        middleware._context.negateNext = false;
        return middleware;
      };
    });

  Object.keys(validator)
    .filter(isSanitizer)
    .forEach(methodName => {
      const sanitizerFn = validator[methodName];
      middleware[methodName] = (...options) => {
        sanitizers.push({
          sanitizer: sanitizerFn,
          options
        });
        return middleware;
      };
    });

  middleware.optional = (options = {}) => {
    optional = options;
    return middleware;
  };

  middleware.custom = validator => {
    validators.push({
      validator,
      custom: true,
      negated: middleware._context.negateNext,
      options: []
    });
    middleware._context.negateNext = false;
    return middleware;
  };

  middleware.customSanitizer = sanitizer => {
    sanitizers.push({
      sanitizer,
      custom: true,
      options: []
    });
    return middleware;
  };

  middleware.exists = () => middleware.custom(existsValidator);
  middleware.isArray = () => middleware.custom(value => Array.isArray(value));
  middleware.isString = () => middleware.custom(value => typeof value === 'string');

  middleware.withMessage = message => {
    const lastValidator = validators[validators.length - 1];
    if (lastValidator) {
      lastValidator.message = message;
    }

    return middleware;
  };

  middleware.not = () => {
    middleware._context.negateNext = true;
    return middleware;
  };

  middleware._context = {
    get optional() {
      return optional;
    },
    negateNext: false,
    message,
    fields,
    locations,
    sanitizers,
    validators
  };

  return middleware;
};

function existsValidator(value) {
  return value !== undefined;
}