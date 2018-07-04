const check = require('./check');
const validator = require('validator');
const {
  buildCheckFunction
} = require('./validation-chain-builders');

const createCheckAPI = ({
  customValidators,
  customSanitizers
} = {}) => {
  const customCheck = (fields, locations, message) =>
    check(
      fields,
      locations,
      message,
      Object.assign({}, customValidators, validator),
      Object.assign({}, customSanitizers, validator)
    );
  return {
    checkSchema: (schema, defaultLocations) =>
      require('./schema')(schema, defaultLocations, customCheck),
    check: buildCheckFunction(['body', 'cookies', 'headers', 'params', 'query'], undefined, customCheck),
    body: buildCheckFunction(['body'], undefined, customCheck),
    cookie: buildCheckFunction(['cookies'], undefined, customCheck),
    header: buildCheckFunction(['headers'], undefined, customCheck),
    param: buildCheckFunction(['params'], undefined, customCheck),
    query: buildCheckFunction(['query'], undefined, customCheck),
    oneOf: require('./one-of'),
    validationResult: require('./validation-result')
  };
};

module.exports = createCheckAPI;
