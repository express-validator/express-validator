const validator = require('validator');

const { extraSanitizers } = require('../utils/constants');
const persistValues = require('../utils/persist-values');

module.exports = (fields, locations) => {
  const sanitizers = [];
  fields = Array.isArray(fields) ? fields : [fields];

  const middleware = (req, res, next) => {
    persistValues(req, { fields, locations, sanitizers });
    next();
  };

  Object.keys(validator)
    .filter(methodName => methodName.startsWith('to') || extraSanitizers.includes(methodName))
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