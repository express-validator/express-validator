const checkModule = require('./check');

const buildCheckFunction = locations => (fields, message, check = checkModule) => check(fields, locations, message);
module.exports = {
  buildCheckFunction,
  check: buildCheckFunction(['body', 'cookies', 'headers', 'params', 'query']),
  body: buildCheckFunction(['body']),
  cookie: buildCheckFunction(['cookies']),
  header: buildCheckFunction(['headers']),
  param: buildCheckFunction(['params']),
  query: buildCheckFunction(['query'])
};
