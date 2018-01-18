const {
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery
} = require('./sanitization-chain-builders');

module.exports = {
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery,
  matchedData: require('./matched-data')
};