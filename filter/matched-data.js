const _ = require('lodash');
const selectFields = require('../utils/select-fields');

module.exports = (req, options = {}) => {
  const fieldExtractor = createFieldExtractor(req, options);
  const validityFilter = createValidityFilter(req, options);
  const locationsFilter = createLocationFilter(options);

  return _(req._validationContexts)
    .flatMap(fieldExtractor)
    .filter(validityFilter)
    .map(field => field.instance)
    .filter(locationsFilter)
    .reduce((state, field) => _.set(state, field.path, field.value), {})
    .valueOf();
};

function createFieldExtractor(req, { includeOptionals }) {
  return context => [].concat(selectFields(req, context, {
    filterOptionals: includeOptionals !== true,
    // By the time we get here, all sanitizers did run, so we don't want double sanitization.
    sanitize: false
  })).map(instance => ({
    instance,
    context
  }));
}

function createValidityFilter(req, { onlyValidData }) {
  onlyValidData = onlyValidData === undefined ? true : onlyValidData;
  return !onlyValidData ? () => true : field => {
    const hasError = req._validationErrors.some(error => (
      error.param === field.instance.path &&
      error.location === field.instance.location
    ));
    const isFailedOneOfGroup = (req._validationOneOfFailures || []).includes(field.context);

    return !(hasError || isFailedOneOfGroup);
  };
}

function createLocationFilter({ locations }) {
  const allLocations = !Array.isArray(locations) || locations.length === 0;
  return allLocations ? () => true : field => locations.includes(field.location);
}