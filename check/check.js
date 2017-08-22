const validator = require('validator');

const runner = require('./runner');

const extraValidators = ['contains', 'equals', 'matches'];

module.exports = (fields, locations, message) => {
  let optional;
  const validators = [];
  fields = Array.isArray(fields) ? fields : [fields];

  const middleware = (req, res, next) => {
    return runner(req, middleware._context).then(errors => {
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
          validator: validationFn,
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
      options: []
    });
    return middleware;
  };

  middleware.withMessage = message => {
    validators[validators.length - 1].message = message;
    return middleware;
  };

  middleware._context = {
    get optional () {
      return optional;
    },
    message,
    fields,
    locations,
    validators
  };

  return middleware;
};