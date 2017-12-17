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

  it('returns chain with all validator\'s sanitization methods', () => {
    const chain = check('foo', []);
    Object.keys(validator)
      .filter(methodName => methodName.startsWith('to'))
      .forEach(methodName => {
        expect(chain).to.have.property(methodName);
      });

    expect(chain).to.have.property('blacklist');
    expect(chain).to.have.property('escape');
    expect(chain).to.have.property('unescape');
    expect(chain).to.have.property('normalizeEmail');
    expect(chain).to.have.property('ltrim');
    expect(chain).to.have.property('rtrim');
    expect(chain).to.have.property('trim');
    expect(chain).to.have.property('stripLow');
    expect(chain).to.have.property('whitelist');
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

    it('does not throw when there are no validators', () => {
      const chain = check('foo', []);
      expect(chain.withMessage).to.not.throw(Error);
    });
  });

  describe('.exists()', () => {
    it('adds validator for checking if value is not undefined', () => {
      const chain = check('foo').exists();
      const { validators } = chain._context;

      expect(validators[0].validator(undefined)).to.be.false;
      expect(validators[0].validator(null)).to.be.true;
    });
  });

  describe('sanitization methods', () => {
    it('add a sanitizer to the chain context', () => {
      const chain = check('foo').trim();

      expect(chain._context.sanitizers).to.have.length(1);
      expect(chain._context.sanitizers).to.deep.include({
        sanitizer: validator.trim,
        custom: false,
        options: []
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

  describe('.customSanitizer()', () => {
    it('adds a custom sanitizer inline validator', () => {
      const sanitizer = x => x + 1;
      const options = [1, 2,3];
      const chain = check('foo', []).customSanitizer(sanitizer, ...options);

      expect(chain._context.sanitizers[0]).to.eql({
        sanitizer,
        options,
        custom: true
      });
    });
  });
});
