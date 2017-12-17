const expect = require('chai').expect;
const expressValidator = require('..');

describe('Legacy: Schema validation', () => {
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
  checkObject('cookies');
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

  it('applies sanitizers', () => {
    const req = {
      body: { trimmed: '  ' }
    };

    expressValidator()(req, {}, () => {});
    req.check({
      trimmed: {
        trim: true,
        notEmpty: true
      }
    });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.property('trimmed');
    });
  });

  it('ignores validators which values are falsy', () => {
    const req = {
      body: {
        int: 'asd',
        upper: 'qwe'
      }
    };

    expressValidator()(req, {}, () => {});
    req.check({
      int: { isInt: true },
      upper: { isUppercase: false }
    });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.property('int');
      expect(result.mapped()).to.not.have.property('upper');
    });
  });

  it('does not throw when a validator does not exist', () => {
    const req = {};
    expressValidator()(req, {}, () => {});

    const setValidators = () => req.check({
      foo: { isBar: true }
    });

    expect(setValidators).not.to.throw(Error);
  });
});