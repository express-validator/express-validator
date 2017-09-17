const expect = require('chai').expect;
const sanitizeQuery = require('./sanitize-query');

describe('filter: sanitizeQuery middleware', () => {
  it('sanitizes query', () => {
    const req = {
      query: { foo: '123' }
    };

    sanitizeQuery('foo').toInt()(req, {}, () => {});
    expect(req.query.foo).to.equal(123);
  });
});