const checkObjectSpec = require('./spec-helpers').checkObjectSpec;

describe('req.checkBody()', () => {
  checkObjectSpec('body');
});