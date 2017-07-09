const sanitizeObjectSpec = require('./spec-helpers').sanitizeObjectSpec;

describe('req.sanitizeQuery()', () => {
  sanitizeObjectSpec('query');
});