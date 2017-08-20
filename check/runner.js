const get = require('lodash.get');

module.exports = (req, context) => {
  const validationErrors = [];
  const allFields = [];
  const { locations } = context;

  context.fields.forEach(field => locations.forEach(location => {
    allFields.push({
      location,
      path: field,
      value: location === 'headers' ? req.get(field) : get(req[location], field)
    });
  }));

  const promises = allFields.filter(field => {
    return locations.length > 1 ? field.value !== undefined : true;
  }).map(field => {
    return context.validators.reduce((promise, validatorCfg) => promise.then(() => {
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

  return Promise.all(promises).then(() => validationErrors);
};