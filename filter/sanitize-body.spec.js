const expect = require('chai').expect;
const sanitizeBody = require('./sanitize-body');

describe('filter: sanitizeBody middleware', () => {
  it('sanitizes body', () => {
    const req = {
      body: { foo: '123' }
    };

    sanitizeBody('foo').toInt()(req, {}, () => {});
    expect(req.body.foo).to.equal(123);
  });
});