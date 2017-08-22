const checkObjectSpec = require('./spec-helpers').checkObjectSpec;

describe('Legacy: req.checkBody()', () => {
  checkObjectSpec('body');
});