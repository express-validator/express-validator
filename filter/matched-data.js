const _ = require('lodash');
const selectFields = require('../utils/select-fields');

module.exports = (req, options = {}) => {
  const validityFilter = createValidityFilter(req, options);
  const locationsFilter = createLocationFilter(options);

  return _(req._validationContexts)
    .flatMap(context => selectFields(req, context))
    .filter(validityFilter)
    .filter(locationsFilter)
    .reduce((state, field) => _.set(state, field.path, field.value), {})
    .valueOf();
};

function createValidityFilter(req, { onlyValidData }) {
  onlyValidData = onlyValidData === undefined ? true : onlyValidData;
  return !onlyValidData ? () => true : field => {
    const isSameRef = error => (
      error.param === field.path &&
      error.location === field.location
    );

    const failed =
      req._validationErrors.some(isSameRef) ||
      (req._validationErrorsOneOf || []).some(isSameRef);

    return !failed;
  };
}

function createLocationFilter({ locations }) {
  const allLocations = !Array.isArray(locations) || locations.length === 0;
  return allLocations ? () => true : field => locations.includes(field.location);
}