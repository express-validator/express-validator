const expect = require('chai').expect;
const checkHeaders = require('./check-headers');

describe('check: checkHeaders middleware', () => {
  it('checks only the params location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      headers: { Foo: 'asd' }
    };

    return checkHeaders('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'headers');
    });
  });
});