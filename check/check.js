const get = require('lodash.get');
const validator = require('validator');
const extraValidators = ['contains', 'equals', 'matches'];

module.exports = (fields, locations) => {
  const validators = [];
  fields = Array.isArray(fields) ? fields : [fields];

  const middleware = (req, res, next) => {
    const validationErrors = [];
    const allFields = [];

    fields.forEach(field => locations.forEach(location => {
      allFields.push({
        location,
        path: field,
        value: location === 'headers' ? req.get(field) : get(req[location], field)
      });
    }));

    const promises = allFields.filter(field => {
      return locations.length > 1 ? field.value !== undefined : true;
    }).map(field => {
      return validators.reduce((promise, validatorCfg) => promise.then(() => {
        const result = validatorCfg.custom ?
          validatorCfg.validator(field.value, req) :
          validatorCfg.validator(String(field.value), ...validatorCfg.options);

        return Promise.resolve(result).then(result => {
          if (!result) {
            throw new Error('Invalid value');
          }
        });
      }).catch(err => {
        validationErrors.push({
          location: field.location,
          path: field.path,
          value: field.value,
          message: validatorCfg.message || err.message
        });
      }), Promise.resolve());
    });

    return Promise.all(promises).then(() => {
      req._validationErrors = validationErrors;
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

  return middleware;
};