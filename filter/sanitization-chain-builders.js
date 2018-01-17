const sanitize = require('./sanitize');

const buildSanitizeFunction = locations => fields => sanitize(fields, locations);
module.exports = {
  buildSanitizeFunction,
  sanitize: buildSanitizeFunction(['body', 'cookies', 'params', 'query']),
  sanitizeBody: buildSanitizeFunction(['body']),
  sanitizeCookie: buildSanitizeFunction(['cookies']),
  sanitizeParam: buildSanitizeFunction(['params']),
  sanitizeQuery: buildSanitizeFunction(['query'])
};