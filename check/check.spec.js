const validator = require('validator');
const expect = require('chai').expect;
const check = require('./check');

describe('low-level check middleware', () => {
  it('returns chain with all validator\'s validation methods', () => {
    const chain = check('foo', []);
    Object.keys(validator)
      .filter(methodName => methodName.startsWith('is'))
      .forEach(methodName => {
        expect(chain).to.have.property(methodName);
      });

    expect(chain).to.have.property('contains');
    expect(chain).to.have.property('equals');
    expect(chain).to.have.property('matches');
  });

  describe('fields selection', () => {
    it('is done in all given request locations', () => {
      const req = {
        body: { foo: 'a' },
        params: { foo: 'b' },
        query: { foo: 'c' }
      };
      const middleware = check('foo', ['body', 'query']).isInt();
      return middleware(req, {}, () => {}).then(() => {
        expect(req._validationErrors).to.have.length(2);
      });
    });

    it('ignores a location if the field does not exist there and other locations were specified', () => {
      const req = {
        body: { foo: 'a' },
        query: {}
      };
      const middleware = check('foo', ['body', 'query']).isInt();
      return middleware(req, {}, () => {}).then(() => {
        expect(req._validationErrors).to.have.length(1);
      });
    });

    it('accepts multiple fields using array', () => {
      const req = {
        query: { a: 'ASD', b: 'BCA' }
      };

      const middleware = check(['a', 'b'], ['query']).isLowercase();
      return middleware(req, {}, () => {}).then(() => {
        expect(req._validationErrors).to.have.length(2);
      });
    });

    it('is done in nested locations using dot-notation and square brackets', () => {
      const req = {
        body: { foo: [{ bar: 'a' }] }
      };

      const middleware = check('foo[0].bar', ['body']).isInt();
      return middleware(req, {}, () => {}).then(() => {
        expect(req._validationErrors).to.have.length(1);
      });
    });
  });

  describe('validation errors', () => {
    it('are pushed to req._validationErrors', () => {
      const req = {
        body: { foo: 'foo@example.com', bar: 'not_email' }
      };

      return check(['foo', 'bar'], ['body']).isEmail()(req, {}, () => {}).then(() => {
        expect(req)
          .to.have.property('_validationErrors')
          .that.is.an('array')
          .that.has.lengthOf(1);
      });
    });

    it('are kept from other middleware calls', () => {
      const req = {
        query: { foo: '123', bar: 'BAR' }
      };

      return Promise.all([
        check('foo', ['query']).isAlpha()(req, {}, () => {}),
        check('bar', ['query']).isInt()(req, {}, () => {})
      ]).then(() => {
        expect(req._validationErrors).to.have.length(2);
      });
    });
  });
});