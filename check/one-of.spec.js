const { expect } = require('chai');
const { check, oneOf } = require('./');

describe('check: checkOneOf middleware', () => {
  it('does not return errors if any chain succeeded', () => {
    const req = {
      cookies: { foo: '123', bar: 'abc' }
    };

    return oneOf([
      check('foo').isInt(),
      check('bar').isInt()
    ])(req, {}, () => {}).then(errors => {
      expect(errors).to.eql([]);
    });
  });

  it('uses first error list in case all chains failed', () => {
    const req = {
      cookies: { foo: 'abc', bar: 'def' }
    };

    return oneOf([
      check('foo').isInt(),
      check('bar').isInt()
    ])(req, {}, () => {}).then(errors => {
      expect(errors)
        .to.have.length(1)
        .and.to.deep.include({
          location: 'cookies',
          path: 'foo',
          value: 'abc',
          message: 'Invalid value'
        });
    });
  });

  describe('validation errors', () => {
    it('are not set in the request if any chain succeeded', done => {
      const req = {
        cookies: { foo: '123', bar: 'abc' }
      };

      oneOf([
        check('foo').isInt(),
        check('bar').isInt()
      ])(req, {}, () => {
        expect(req).to.not.have.property('_validationErrors');
        done();
      });
    });

    it('are pushed to req._validationErrors', done => {
      const req = {
        body: { foo: 'not_email' }
      };

      oneOf([
        check('foo').isEmail(),
        check('foo').isNumeric()
      ])(req, {}, () => {
        expect(req)
          .to.have.property('_validationErrors')
          .that.is.an('array')
          .that.has.lengthOf(1);

        done();
      });
    });

    it('are kept from other middleware calls', () => {
      const req = {
        query: { foo: '123', bar: 'BAR' }
      };

      return Promise.all([
        oneOf([ check('foo').isAlpha() ])(req, {}, () => {}),
        oneOf([ check('bar').isInt() ])(req, {}, () => {})
      ]).then(() => {
        expect(req._validationErrors).to.have.length(2);
      });
    });
  });
});