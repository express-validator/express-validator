const { checkObjectSpec } = require('./spec-helpers');

describe('req.checkBody()', () => {
  checkObjectSpec('body');
});