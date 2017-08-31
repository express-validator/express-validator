const validator = require('validator');

const runner = require('./runner');

const extraValidators = ['contains', 'equals', 'matches'];

module.exports = (fields, locations, message) => {
  let optional;
  const validators = [];
  fields = Array.isArray(fields) ? fields : [fields];

  const middleware = (req, res, next) => {
    return runner(req, middleware._context).then(errors => {
      req._validationContexts = (req._validationContexts || []).concat(middleware._context);
      req._validationErrors = (req._validationErrors || []).concat(errors);
      next();
    }, next);
  };

  Object.keys(validator)
    .filter(methodName => methodName.startsWith('is') || extraValidators.includes(methodName))
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

  middleware.exists = () => middleware.custom(existsValidator);

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
    get optional () {
      return optional;
    },
    negateNext: false,
    message,
    fields,
    locations,
    validators
  };

  return middleware;
};

function existsValidator (value) {
  return value !== undefined;
}