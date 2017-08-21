const selectFields = require('./select-fields');

module.exports = (req, context) => {
  const validationErrors = [];
  const promises = selectFields(req, context).map(field => {
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