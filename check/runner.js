const toString = require('../utils/to-string');
const selectFields = require('../utils/select-fields');

module.exports = (req, context) => {
  const validationErrors = [];
  const promises = selectFields(req, context).map(field => {
    const { location, path, value } = field;
    return context.validators.reduce((promise, validatorCfg) => promise.then(() => {
      const result = validatorCfg.custom ?
        validatorCfg.validator(value, { req, location, path }) :
        validatorCfg.validator(toString(value), ...validatorCfg.options);

      return getActualResult(result).then(result => {
        if ((!validatorCfg.negated && !result) || (validatorCfg.negated && result)) {
          return Promise.reject();
        }
      });
    }).catch(err => {
      validationErrors.push({
        location,
        param: path,
        value,
        msg: getDynamicMessage([
          validatorCfg.message,
          err && err.message,
          err,
          context.message,
          'Invalid value'
        ], field, req)
      });
    }), Promise.resolve());
  });

  return Promise.all(promises).then(() => validationErrors);
};

function getActualResult(result) {
  const promiseLike = !!result.then;
  return Promise.resolve(result).then(result => {
    return result === undefined && promiseLike ? true : result;
  });
}

function getDynamicMessage(messageSources, field, req) {
  const message = messageSources.find(message => !!message);
  if (typeof message !== 'function') {
    return message;
  }

  return message(field.value, {
    req,
    location: field.location,
    path: field.path
  });
}