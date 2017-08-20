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

  describe('validators', () => {
    it('receive value and request when is a custom', () => {
      const req = {
        body: { foo: 'wut', bar: '123', suffix: '4' }
      };

      const middleware = check(['foo', 'bar'], ['body']).custom((value, req) => {
        return /^\d+$/.test(value + req.body.suffix);
      });

      return middleware(req, {}, () => {}).then(() => {
        expect(req._validationErrors[0]).to.have.property('path', 'foo');
      });
    });

    it('receive value and options when is a default', () => {
      const req = {
        query: { withzero: '0123', withoutzero: '123' }
      };

      const middleware = check(['withzero', 'withoutzero'], ['query']).isInt({
        allow_leading_zeroes: false
      });

      return middleware(req, {}, () => {}).then(() => {
        expect(req._validationErrors[0].path).to.equal('withzero');
      });
    });
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

    it('contain the location, path, value and message', () => {
      const req = {
        params: { foo: 'not_email_params' },
        query: { foo: 'not_email_query' },
        body: { foo: 'not_email_body' }
      };

      return check('foo', [
        'params',
        'query',
        'body'
      ]).isEmail()(req, {}, () => {}).then(() => {
        expect(req._validationErrors).to.deep.include({
          location: 'params',
          path: 'foo',
          value: 'not_email_params',
          message: 'Invalid value'
        });

        expect(req._validationErrors).to.deep.include({
          location: 'body',
          path: 'foo',
          value: 'not_email_body',
          message: 'Invalid value'
        });

        expect(req._validationErrors).to.deep.include({
          location: 'query',
          path: 'foo',
          value: 'not_email_query',
          message: 'Invalid value'
        });
      });
    });
  });

  describe('error messages', () => {
    it('are by default "Invalid value"', () => {
      const req = {
        query: { foo: 'aa' }
      };

      return check('foo', ['query']).isInt()(req, {}, () => {}).then(() => {
        expect(req._validationErrors[0]).to.have.property('message', 'Invalid value');
      });
    });

    it('use validator\'s exception message', () => {
      const req = {
        query: { foo: 'foo' }
      };

      const middleware = check('foo', ['query']).custom(() => {
        throw new Error('wat');
      });

      return middleware(req, {}, () => {}).then(() => {
        expect(req._validationErrors[0]).to.have.property('message', 'wat');
      });
    });

    it('are overwritten for the last validator by .withMessage() chain method', () => {
      const req = {
        query: { foo: 123, bar: 'not int' }
      };

      const middleware = check(['foo', 'bar'], ['query'])
        .isInt()
        .custom(value => {
          throw new Error('wat');
        })
        .withMessage('wut!');

      return middleware(req, {}, () => {}).then(() => {
        expect(req._validationErrors).to.deep.include({
          path: 'foo',
          value: 123,
          location: 'query',
          message: 'wut!'
        });

        expect(req._validationErrors).to.deep.include({
          path: 'bar',
          value: 'not int',
          location: 'query',
          message: 'Invalid value'
        });

        expect(req._validationErrors).to.deep.include({
          path: 'bar',
          value: 'not int',
          location: 'query',
          message: 'wut!'
        });
      });
    });
  });
});