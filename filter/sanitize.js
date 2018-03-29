const validator = require('validator');

const { isSanitizer } = require('../utils/filters');
const persistValues = require('../utils/persist-values');

module.exports = (fields, locations) => {
  const sanitizers = [];
  fields = Array.isArray(fields) ? fields : [fields];

  const middleware = (req, res, next) => {
    persistValues(req, { fields, locations, sanitizers });
    next();
  };

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

  middleware.customSanitizer = sanitizer => {
    sanitizers.push({
      sanitizer,
      custom: true,
      options: []
    });
    return middleware;
  };

  return middleware;
};