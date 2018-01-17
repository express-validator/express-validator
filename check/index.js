const { check, body, cookie, header, param, query } = require('./validation-chain-builders');

module.exports = {
  check,
  body,
  cookie,
  header,
  param,
  query,
  oneOf: require('./one-of'),
  validationResult: require('./validation-result')
};