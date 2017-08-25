const _ = require('lodash');
const utils = require('../lib/utils');

module.exports = (req, context) => {
  let allFields = [];
  const optionalityFilter = createOptionalityFilter(context);

  context.fields.forEach(field => {
    let instances = _(context.locations)
      .flatMap(createFieldExpander(req, field))
      .filter(optionalityFilter)
      .value();

    if (instances.length > 1) {
      const withValue = instances.filter(field => field.value !== undefined);
      instances = withValue.length ? withValue : [instances[0]];
    }

    allFields = allFields.concat(instances);
  });

  return _.uniqWith(allFields, _.isEqual);
};

function createFieldExpander (req, field) {
  return location => {
    const fieldPath = location === 'headers' ? field.toLowerCase() : field;
    return expand(req[location], fieldPath, []).map(path => ({
      location,
      path,
      value: _.get(req[location], path)
    }));
  };
}

function expand (object, path, paths) {
  const segments = _.toPath(path);
  const wildcard = segments.indexOf('*');

  if (wildcard > -1) {
    const subObject = wildcard ? _.get(object, segments.slice(0, wildcard)) : object;
    if (!subObject) {
      return paths;
    }

    Object.keys(subObject)
      .map(key => segments
        .slice(0, wildcard)
        .concat(key)
        .concat(segments.slice(wildcard + 1)))
      .forEach(path => expand(object, path, paths));
  } else {
    paths.push(utils.formatParamOutput(segments));
  }

  return paths;
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