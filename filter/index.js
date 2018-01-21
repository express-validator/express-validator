const {
  buildSanitizeFunction,
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery
} = require('./sanitization-chain-builders');

module.exports = {
  buildSanitizeFunction,
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery,
  matchedData: require('./matched-data')
};