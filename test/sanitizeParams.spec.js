const sanitizeObjectSpec = require('./spec-helpers').sanitizeObjectSpec;

describe('req.sanitizeParams()', () => {
  sanitizeObjectSpec('params');
});