const expect = require('chai').expect;
const checkQuery = require('./check-query');

describe('check: checkQuery middleware', () => {
  it('checks only the query location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      get: { headers: 'asd' }
    };

    return checkQuery('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'query');
    });
  });
});