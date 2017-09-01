const expect = require('chai').expect;
const expressValidator = require('..');

describe('Legacy: Message customization', () => {
  const checkObject = checkedObject => {
    const methodName = 'check' + checkedObject[0].toUpperCase() + checkedObject.substr(1);

    it(`can be done with 2nd arg of req.${methodName}()`, () => {
      const req = {
        [checkedObject]: { color: 'asd' }
      };

      expressValidator()(req, {}, () => {});
      req[methodName]('color', '"%0" is not a color').isHexColor();

      return req.getValidationResult().then(result => {
        expect(result.mapped()).to.have.deep.property('color.msg', '"asd" is not a color');
      });
    });
  };

  checkObject('body');
  checkObject('cookies');
  checkObject('headers');
  checkObject('params');
  checkObject('query');

  it('can be done with 2nd arg of req.check()', () => {
    const req = {
      body: { color: 'asd' }
    };

    expressValidator()(req, {}, () => {});
    req.check('color', '"%0" is not a color').isHexColor();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.deep.property('color.msg', '"asd" is not a color');
    });
  });

  it('can be done per-validator using .withMessage()', () => {
    const req = {
      body: { password: 'abc123' }
    };

    expressValidator()(req, {}, () => {});
    req.check('password')
      .isLength({ min: 3 }).withMessage('use a stronger password')
      .matches(/^(?!abc123)$/).withMessage('do not use a common password');

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.deep.property('password.msg', 'do not use a common password');
    });
  });

  it('can be done in schema', () => {
    const req = {
      body: { color: 'asd' }
    };

    expressValidator()(req, {}, () => {});
    req.check({
      color: {
        errorMessage: '"%0" is not a color',
        isHexColor: true
      }
    });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.deep.property('color.msg', '"asd" is not a color');
    });
  });

  it('can be done per-validator in a schema', () => {
    const req = {
      body: { password: 'abc123' }
    };

    expressValidator()(req, {}, () => {});
    req.check({
      password: {
        isLength: {
          options: { min: 3 },
          errorMessage: 'use a stronger password'
        },
        matches: {
          options: /^(?!abc123)$/,
          errorMessage: 'do not use a common password'
        }
      }
    });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.deep.property('password.msg', 'do not use a common password');
    });
  });

  it('works with non-string messages', () => {
    const req = {
      body: { color: 'asd' }
    };

    expressValidator()(req, {}, () => {});
    req.check('color', { code: 1, msg: 'damn!' }).isHexColor();

    return req.getValidationResult().then(result => {
      expect(result.mapped())
        .to.have.deep.property('color.msg')
        .and.to.eql({
          code: 1,
          msg: 'damn!'
        });
    });
  });
});