const check = require('./check');
const validLocations = ['body', 'cookies', 'headers', 'params', 'query'];
const notValidators = ['errorMessage', 'in'];

module.exports = schema => Object.keys(schema)
  .filter(field => field !== 'in')
  .map(field => {
    const config = schema[field];
    const chain = check(
      field,
      ensureLocations(config),
      config.errorMessage
    );

    Object.keys(config)
      .filter(method => config[method] && !notValidators.includes(method))
      .forEach(method => {
        if (typeof chain[method] !== 'function') {
          console.warn(`express-validator: a validator with name ${method} does not exist`);
          return;
        }

        const methodCfg = config[method];

        let options = methodCfg.options || [];
        if (options != null && !Array.isArray(options)) {
          options = [options];
        }

        chain[method](...options);
        if (method !== 'optional') {
          chain.withMessage(methodCfg.errorMessage);
        }
      });

    return chain;
  });

function ensureLocations(config) {
  const locations = Array.isArray(config.in) ? config.in : [config.in];
  const actualLocations = locations.filter(location => validLocations.includes(location));

  return actualLocations.length ? actualLocations : validLocations;
}