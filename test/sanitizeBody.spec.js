const sanitizeObjectSpec = require('./spec-helpers').sanitizeObjectSpec;

describe('req.sanitizeBody()', () => {
  sanitizeObjectSpec('body');
});