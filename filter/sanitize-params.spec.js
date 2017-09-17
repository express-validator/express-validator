const expect = require('chai').expect;
const sanitizeParams = require('./sanitize-params');

describe('filter: sanitizeParams middleware', () => {
  it('sanitizes params', () => {
    const req = {
      params: { foo: '123' }
    };

    sanitizeParams('foo').toInt()(req, {}, () => {});
    expect(req.params.foo).to.equal(123);
  });
});