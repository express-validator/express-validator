const validator = require('validator');
const expect = require('chai').expect;
const check = require('./check');

describe('check: low-level middleware', () => {
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

  it('is built with field search locations set via 2rd arg', () => {
    const chain = check('foo', ['foo', 'bar']);
    expect(chain._context)
      .to.have.property('locations')
      .that.eqls(['foo', 'bar']);
  });

  it('is built with a context message set via 3rd arg', () => {
    const chain = check('foo', [], 'Fail!');
    expect(chain._context).to.have.property('message', 'Fail!');
  });

  describe('.custom()', () => {
    it('adds a custom inline validator', () => {
      const validator = () => true;
      const chain = check('foo', []).custom(validator);

      expect(chain._context.validators[0]).to.eql({
        validator,
        options: [],
        negated: false,
        custom: true
      });
    });
  });

  describe('.optional()', () => {
    it('sets optional flag in context', () => {
      const chain = check('foo', []).optional();
      expect(chain._context).to.have.property('optional');
    });
  });

  describe('.withMessage()', () => {
    it('sets error message for last validator', () => {
      const chain = check('foo', [])
        .isUppercase()
        .isEmail()
        .withMessage('wat');

      const { validators } = chain._context;
      expect(validators).to.not.have.deep.property('[0].message');
      expect(validators).to.have.deep.property('[1].message', 'wat');
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