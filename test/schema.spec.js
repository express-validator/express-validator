const { expect } = require('chai');
const expressValidator = require('..');

describe('Schema validation', () => {
  const checkObject = checkedObject => {
    const methodName = 'check' + checkedObject[0].toUpperCase() + checkedObject.substr(1);

    it(`works with req.${methodName}()`, () => {
      const req = {
        [checkedObject]: { upper: 'ASD', lower: 'QWE' }
      };

      expressValidator()(req, {}, () => {});
      req[methodName]({
        upper: {
          isUppercase: true
        },
        lower: {
          isLowercase: true
        }
      });

      return req.getValidationResult().then(result => {
        expect(result.mapped()).to.not.have.property('upper');
        expect(result.mapped()).to.have.property('lower');
      });
    });
  };

  checkObject('body');
  checkObject('headers');
  checkObject('params');
  checkObject('query');

  it('works with req.check()', () => {
    const req = {
      params: { int: '123' },
      query: { int: 'asd', alpha: 'asd' },
      body: { int: 'foo', alpha: '123', upper: 'BAR' }
    };

    expressValidator()(req, {}, () => {});
    req.check({
      int: { isInt: true },
      alpha: { isAlpha: true },
      upper: { isUppercase: true }
    });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.eql({});
    });
  });

  it('works with req.check() specifying location in request', () => {
    const req = {
      params: { int: '123', upper: 'bar' },
      query: { int: 'asd', alpha: 'asd' },
      body: { alpha: '123', upper: 'BAR' }
    };

    expressValidator()(req, {}, () => {});
    req.check({
      int: {
        in: 'query',
        isInt: true
      },
      alpha: {
        in: 'body',
        isAlpha: true
      },
      upper: {
        in: 'params',
        isUppercase: true
      }
    });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.property('int');
      expect(result.mapped()).to.have.property('alpha');
      expect(result.mapped()).to.have.property('upper');
    });
  });

  it('skips unknown location', () => {
    const req = {};

    expressValidator()(req, {}, () => {});
    req.check({
      int: {
        in: 'whoa',
        isInt: true
      }
    });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.eql({});
    });
  });
});