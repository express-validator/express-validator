const expect = require('chai').expect;
const sanitizeObjectSpec = require('./spec-helpers').sanitizeObjectSpec;
const expressValidator = require('..');

describe('Legacy: req.sanitizeHeaders()', () => {
  sanitizeObjectSpec('headers');

  it('sanitizes "referrer" as alias to "referer"', () => {
    const req = {
      headers: { referer: '123' }
    };

    expressValidator()(req, {}, () => {});
    req.sanitizeHeaders('referrer').toInt();

    expect(req.headers.referer).to.equal(123);
  });
});