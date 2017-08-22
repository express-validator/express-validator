const checkObjectSpec = require('./spec-helpers').checkObjectSpec;

describe('Legacy: req.checkCookies()', () => {
  checkObjectSpec('cookies');
});