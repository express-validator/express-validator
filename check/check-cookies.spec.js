const expect = require('chai').expect;
const checkCookies = require('./check-cookies');

describe('check: checkCookies middleware', () => {
  it('checks only the cookies location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      headers: { foo: 'asd' }
    };

    return checkCookies('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'cookies');
    });
  });
});