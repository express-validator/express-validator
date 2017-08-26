const _ = require('lodash');
const selectFields = require('../check/select-fields');

module.exports = (req, { onlyValidData = true } = {}) => {
  const validityFilter = !onlyValidData ? () => true : field => {
    return !req._validationErrors.find(error =>
      error.param === field.path &&
      error.location === field.location
    );
  };

  return _(req._validationContexts)
    .flatMap(context => selectFields(req, context))
    .filter(validityFilter)
    .reduce((state, field) => _.set(state, field.path, field.value), {})
    .valueOf();
};