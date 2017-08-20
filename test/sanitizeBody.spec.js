const sanitizeObjectSpec = require('./spec-helpers').sanitizeObjectSpec;

describe('Legacy: req.sanitizeBody()', () => {
  sanitizeObjectSpec('body');
});