const { expect } = require('chai');
const { checkObjectSpec } = require('./spec-helpers');
const expressValidator = require('..');

describe('req.checkHeaders()', () => {
  checkObjectSpec('headers');

  it('checks "referrer" as alias to "referer"', () => {
    const req = {
      headers: { referer: '123' }
    };

    expressValidator()(req, {}, () => {});
    req.checkHeaders('referrer').isInt();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.eql({});
    });
  });
});