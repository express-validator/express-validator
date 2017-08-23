const { expect } = require('chai');
const expressValidator = require('..');

describe('Legacy: negation', () => {
  it('does not push sync error if result is negative', () => {
    const req = {
      query: { foo: 'not_email', bar: 'is@email.com' }
    };

    expressValidator()(req, {}, () => {});
    req.check('foo').not().isEmail();
    req.check('bar').not().isEmail();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.not.have.property('foo');
      expect(result.mapped()).to.have.property('bar');
    });
  });

  it('does not push async error if promise resolves', () => {
    const req = {
      query: { foo: 'foo', bar: 'bar' }
    };

    expressValidator({
      customValidators: {
        isFoo: value => new Promise((resolve, reject) => {
          value === 'foo' ? resolve() : reject();
        })
      }
    })(req, {}, () => {});

    req.check('foo').not().isFoo();
    req.check('bar').not().isFoo();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.property('foo');
      expect(result.mapped()).to.not.have.property('bar');
    });
  });
});