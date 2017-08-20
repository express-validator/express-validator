const expect = require('chai').expect;
const expressValidator = require('..');

describe('Legacy: Built-ins', () => {
  describe('validator .notEmpty()', () => {
    const req = {
      params: { foo: '' }
    };

    expressValidator()(req, {}, () => {});
    req.check('foo').notEmpty();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.property('foo');
    });
  });

  describe('validator .len()', () => {
    const req = {
      params: { foo: 'foobar' }
    };

    expressValidator()(req, {}, () => {});
    req.check('foo').len({ max: 3 });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.property('foo');
    });
  });
});