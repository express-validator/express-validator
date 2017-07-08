const { sanitizeObjectSpec } = require('./spec-helpers');

describe('req.sanitizeCookies()', () => {
  sanitizeObjectSpec('cookies');
});