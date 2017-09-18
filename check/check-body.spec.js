const expect = require('chai').expect;
const checkBody = require('./check-body');

describe('check: checkBody middleware', () => {
  it('checks only the body location', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      get: { headers: 'asd' }
    };

    return checkBody('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors)
        .to.have.length(1)
        .and.to.have.deep.property('[0].location', 'body');
    });
  });
});