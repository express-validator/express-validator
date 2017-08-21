const _ = require('lodash');

module.exports = (req, context) => {
  let allFields = [];
  const optionalityFilter = createOptionalityFilter(context);

  context.fields.forEach(field => {
    let instances = context.locations
      .map(location => ({
        location,
        path: field,
        value: getInRequest(req, field, location)
      }))
      .filter(optionalityFilter);

    if (instances.length > 1) {
      const withValue = instances.filter(field => field.value !== undefined);
      instances = withValue.length ? withValue : [instances[0]];
    }

    allFields = allFields.concat(instances);
  });

  return allFields;
};

function getInRequest (req, field, location) {
  field = location === 'headers' ? field.toLowerCase() : field;
  return _.get(req[location], field);
}

function createOptionalityFilter ({ optional }) {
  return field => {
    if (!optional) {
      return true;
    } else if (optional.checkFalsy) {
      return field.value;
    } else {
      return field.value !== undefined;
    }
  };
}