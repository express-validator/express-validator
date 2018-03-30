const _ = require('lodash');
const formatParamOutput = require('./format-param-output');

module.exports = (req, context) => {
  let allFields = [];
  const optionalityFilter = createOptionalityFilter(context);
  const sanitizerMapper = createSanitizerMapper(req, context);

  context.fields.map(field => field == null ? '' : field).forEach(field => {
    let instances = _(context.locations)
      .flatMap(createFieldExpander(req, field))
      .map(sanitizerMapper)
      .filter(optionalityFilter)
      .value();

    if (instances.length > 1 && context.locations.length > 1) {
      const withValue = instances.filter(field => field.value !== undefined);
      instances = withValue.length ? withValue : [instances[0]];
    }

    allFields = allFields.concat(instances);
  });

  return _.uniqWith(allFields, _.isEqual);
};

function createFieldExpander(req, field) {
  return location => {
    const fieldPath = location === 'headers' ? field.toLowerCase() : field;
    return expand(req[location], fieldPath, []).map(path => ({
      location,
      path: path,
      value: path === '' ? req[location] : _.get(req[location], path)
    })).map(field => Object.assign(field, {
      originalValue: field.value
    }));
  };
}

function expand(object, path, paths) {
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
    paths.push(formatParamOutput(segments));
  }

  return paths;
}

function createSanitizerMapper(req, { sanitizers = [] }) {
  return field => sanitizers.reduce((prev, sanitizer) => {
    const value = typeof prev.value === 'string' ?
      callSanitizer(sanitizer, prev) :
      prev.value;

    return Object.assign({}, prev, { value });
  }, field);

  function callSanitizer(config, field) {
    return !config.custom ?
      config.sanitizer(field.value, ...config.options) :
      config.sanitizer(field.value, {
        req,
        location: field.location,
        path: field.path
      });
  }
}

function createOptionalityFilter({ optional }) {
  const checks = [
    value => value !== undefined,
    value => optional.nullable ? value != null : true,
    value => optional.checkFalsy ? value : true
  ];

  return field => {
    if (!optional) {
      return true;
    }

    return checks.every(check => check(field.value));
  };
}
