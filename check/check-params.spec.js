const expect = require('chai').expect;
const checkParams = require('./check-params');

describe('check: checkParams middleware', () => {
  it('checks only the params location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      get: { headers: 'asd' }
    };

    return checkParams('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'params');
    });
  });
});