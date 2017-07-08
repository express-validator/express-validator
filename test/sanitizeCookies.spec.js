const sanitizeObjectSpec = require('./spec-helpers').sanitizeObjectSpec;

describe('req.sanitizeCookies()', () => {
  sanitizeObjectSpec('cookies');
});