const { sanitizeObjectSpec } = require('./spec-helpers');

describe('req.sanitizeParams()', () => {
  sanitizeObjectSpec('params');
});