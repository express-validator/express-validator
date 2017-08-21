const check = require('./check');
module.exports = (fields, message) => check(fields, [
  'body',
  'query',
  'cookies',
  'headers',
  'params'
], message);