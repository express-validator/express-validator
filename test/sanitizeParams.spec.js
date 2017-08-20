const sanitizeObjectSpec = require('./spec-helpers').sanitizeObjectSpec;

describe('Legacy: req.sanitizeParams()', () => {
  sanitizeObjectSpec('params');
});