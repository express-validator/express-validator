const { sanitizeObjectSpec } = require('./spec-helpers');

describe('req.sanitizeBody()', () => {
  sanitizeObjectSpec('body');
});