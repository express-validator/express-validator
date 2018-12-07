const { isValidator } = require('../utils/filters');
const check = require('./check');
const validLocations = ['body', 'cookies', 'headers', 'params', 'query'];
const notValidators = ['errorMessage', 'in'];

module.exports = function (schema, defaultLocations = validLocations, chainCreator = check) {
  return new Schema(schema, defaultLocations, chainCreator).toChains();
}


function Schema(schema, defaultLocations, chainCreator) {
  this._schema = schema;
  this._defaultLocations = defaultLocations;
  this._chainCreator = chainCreator;
}

Schema.prototype.toChains = function () {
  return Object.entries(this._schema).map(
    ([field, config]) => {
      return new SchemaItem(
        field, config, this._defaultLocations, this._chainCreator
      ).toChain();
    }
  );
}


function SchemaItem(field, config, defaultLocations, chainCreator) {
  this._field = field;
  this._config = config;
  this._defaultLocations = defaultLocations;
  this._chainCreator = chainCreator;
}

SchemaItem.prototype.toChain = function () {
  const config = this._config;
  const chain = this._chainCreator(
    this._field,
    this._getLocations(),
    config.errorMessage
  );

  for (let methodTitle of Object.keys(config)) {
    const methodConfig = config[methodTitle];
    if (!methodConfig || notValidators.includes(methodTitle))
      continue;
    if (typeof chain[methodTitle] !== 'function') {
      console.warn(`express-validator: a validator with name ${methodTitle} does not exist`);
      break;
    }
    const options = obtainOptionsFromMethodConfig(methodConfig);

    const methodIsValidator = isValidator(methodTitle) || methodTitle === 'custom' || methodTitle === 'exists';

    methodIsValidator && methodConfig.negated && chain.not();
    chain[methodTitle](...options);
    methodIsValidator && chain.withMessage(methodConfig.errorMessage);
  }
  return chain;
}

SchemaItem.prototype._getLocations = function () {
  const config = this._config;
  let locations = (Array.isArray(config.in) ? config.in : [config.in]).filter(Boolean);
  if (!locations.length)
    locations = this._defaultLocations;

  return locations.filter(location => validLocations.includes(location));
}



function obtainOptionsFromMethodConfig(methodConfig) {
  let options = methodConfig.options || [];
  if (options != null && !Array.isArray(options)) {
    options = [options];
  }
  return options;
}

