const sanitizeObjectSpec = require('./spec-helpers').sanitizeObjectSpec;

describe('Legacy: req.sanitizeQuery()', () => {
  sanitizeObjectSpec('query');
});