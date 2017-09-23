const toString = require('../utils/to-string');
const selectFields = require('./select-fields');

module.exports = (req, context) => {
  const validationErrors = [];
  const promises = selectFields(req, context).map(field => {
    const { location, path, value } = field;
    return context.validators.reduce((promise, validatorCfg) => promise.then(() => {
      const result = validatorCfg.custom ?
        validatorCfg.validator(value, { req, location, path }) :
        validatorCfg.validator(toString(value), ...validatorCfg.options);

      return Promise.resolve(result).then(result => {
        if ((!validatorCfg.negated && !result) || (validatorCfg.negated && result)) {
          throw new Error(context.message || 'Invalid value');
        }
      });
    }).catch(err => {
      validationErrors.push({
        location,
        param: path,
        value,
        msg: validatorCfg.message || err.message || err
      });
    }), Promise.resolve());
  });

  return Promise.all(promises).then(() => validationErrors);
};