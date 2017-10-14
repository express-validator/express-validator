const { expect } = require('chai');
const { check, oneOf } = require('./');

describe('check: checkOneOf middleware', () => {
  it('returns errors from all chains', () => {
    const req = {
      cookies: { foo: 123, bar: 'def' }
    };

    return oneOf([
      check('foo').isInt(),
      check('bar').isInt()
    ])(req, {}, () => {}).then(errors => {
      expect(errors).to.have.length(2);
      expect(errors[0]).to.eql([]);
      expect(errors[1]).to.eql([{
        location: 'cookies',
        param: 'bar',
        value: 'def',
        msg: 'Invalid value'
      }]);
    });
  });

  it('groups arrays of chains', () => {
    const req = {
      cookies: { foo: 'abc', bar: 'def', baz: 123 }
    };

    return oneOf([
      [ check('foo').isInt(), check('bar').isInt() ],
      check('baz').isAlpha()
    ])(req, {}, () => {}).then(errors => {
      expect(errors[0]).to.eql([{
        location: 'cookies',
        param: 'foo',
        value: 'abc',
        msg: 'Invalid value'
      }, {
        location: 'cookies',
        param: 'bar',
        value: 'def',
        msg: 'Invalid value'
      }]);

      expect(errors[1]).to.eql([{
        location: 'cookies',
        param: 'baz',
        value: 123,
        msg: 'Invalid value'
      }]);

      expect(req._validationErrors[0].nestedErrors).to.have.lengthOf(3);
    });
  });

  describe('error message', () => {
    it('is "Invalid value(s)" by default', done => {
      const req = {
        body: { foo: 'not_email' }
      };

      oneOf([ check('foo').isEmail() ])(req, {}, () => {
        expect(req._validationErrors[0]).to.have.property('msg', 'Invalid value(s)');
        done();
      });
    });

    it('is customizable via 2nd arg', done => {
      const req = {
        body: { foo: 'not_email' }
      };

      oneOf([ check('foo').isEmail() ], 'One e-mail must be valid')(req, {}, () => {
        expect(req._validationErrors[0]).to.have.property('msg', 'One e-mail must be valid');
        done();
      });
    });
  });

  describe('validation contexts', () => {
    it('are pushed into the request for shallow array of validations', () => {
      const req = {};

      return oneOf([
        check('foo').isInt(),
        check('bar').isInt()
      ])(req, {}, () => {}).then(() => {
        expect(req._validationContexts).to.have.lengthOf(2);
        expect(req._validationContexts[0]).to.be.an('object');
        expect(req._validationContexts[1]).to.be.an('object');
      });
    });

    it('are pushed into the request for grouped array of validations', () => {
      const req = {};

      return oneOf([
        [ check('foo').isInt(), check('bar').isInt() ],
        check('baz').isAlpha()
      ])(req, {}, () => {}).then(() => {
        expect(req._validationContexts).to.have.lengthOf(3);
        expect(req._validationContexts[0]).to.be.an('object');
        expect(req._validationContexts[1]).to.be.an('object');
        expect(req._validationContexts[2]).to.be.an('object');
      });
    });
  });

  describe('validation errors', () => {
    it('are not pushed if any chain succeeded', done => {
      const req = {
        cookies: { foo: '123', bar: 'abc' }
      };

      oneOf([
        check('foo').isInt(),
        check('bar').isInt()
      ])(req, {}, () => {
        expect(req)
          .to.have.property('_validationErrors')
          .and.to.eql([]);
        done();
      });
    });

    it('are pushed once to req._validationErrors into _error field', done => {
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
          .that.has.length(1);

        expect(req._validationErrors[0]).to.have.property('param', '_error');
        done();
      });
    });

    it('include all errors in nestedErrors property', done => {
      const req = {
        body: { foo: 'not_email' }
      };

      oneOf([
        check('foo').isEmail().withMessage('email'),
        check('foo').isNumeric().withMessage('numeric')
      ])(req, {}, () => {
        const error = req._validationErrors[0];
        expect(error)
          .to.have.property('nestedErrors')
          .that.is.an('array')
          .that.has.length(2);

        expect(error.nestedErrors).to.deep.include({
          param: 'foo',
          msg: 'email',
          location: 'body',
          value: 'not_email'
        });

        expect(error.nestedErrors).to.deep.include({
          param: 'foo',
          msg: 'numeric',
          location: 'body',
          value: 'not_email'
        });

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