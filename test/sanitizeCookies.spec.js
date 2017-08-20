const sanitizeObjectSpec = require('./spec-helpers').sanitizeObjectSpec;

describe('Legacy: req.sanitizeCookies()', () => {
  sanitizeObjectSpec('cookies');
});