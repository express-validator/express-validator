const _ = require('lodash');
const validator = require('validator');

const { extraSanitizers } = require('../utils/constants');
const selectFields = require('../check/select-fields');

module.exports = (fields, locations) => {
  const sanitizers = [];
  fields = Array.isArray(fields) ? fields : [fields];

  const middleware = (req, res, next) => {
    const instances = selectFields(req, { fields, locations, sanitizers });
    instances.forEach(instance => {
      _.set(req[instance.location], instance.path, instance.value);
    });

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

  return middleware;
};