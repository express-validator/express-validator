const { sanitizeObjectSpec } = require('./spec-helpers');

describe('req.sanitizeQuery()', () => {
  sanitizeObjectSpec('query');
});