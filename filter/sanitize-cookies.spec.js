const expect = require('chai').expect;
const sanitizeCookies = require('./sanitize-cookies');

describe('filter: sanitizeCookies middleware', () => {
  it('sanitizes cookies', () => {
    const req = {
      cookies: { foo: '123' }
    };

    sanitizeCookies('foo').toInt()(req, {}, () => {});
    expect(req.cookies.foo).to.equal(123);
  });
});