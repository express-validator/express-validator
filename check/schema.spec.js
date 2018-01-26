const { expect } = require('chai');
const checkSchema = require('./schema');

describe('check: schema', () => {
  it('creates a validation chain for each field in the schema', () => {
    const chains = checkSchema({
      foo: {},
      bar: {}
    });

    expect(chains).to.have.lengthOf(2);
    expect(chains[0]._context).to.have.deep.property('fields', ['foo']);
    expect(chains[1]._context).to.have.deep.property('fields', ['bar']);
  });

  it('creates chain with an error message', () => {
    const chain = checkSchema({
      foo: {
        errorMessage: 'bar'
      }
    })[0];

    expect(chain._context).to.have.property('message', 'bar');
  });

  describe('locations', () => {
    it('includes by default all of them', () => {
      const chain = checkSchema({
        foo: {}
      })[0];

      expect(chain._context.locations).to.eql([
        'body',
        'cookies',
        'headers',
        'params',
        'query'
      ]);
    });

    it('includes location in "in" when string', () => {
      const chain = checkSchema({
        foo: {
          in: 'body'
        }
      })[0];

      expect(chain._context.locations).to.eql(['body']);
    });

    it('includes locations in "in" when array', () => {
      const chain = checkSchema({
        foo: {
          in: ['body', 'params']
        }
      })[0];

      expect(chain._context.locations).to.eql(['body', 'params']);
    });
  });

  describe('on each field', () => {
    it('adds known validators', () => {
      const chain = checkSchema({
        foo: {
          errorMessage: 'bla',
          isInt: true,
          isBla: true
        }
      })[0];

      // errorMessage and isBla aren't validators
      expect(chain._context)
        .to.have.property('validators')
        .and.to.have.lengthOf(1);
    });

    it('adds validators with options and error message', () => {
      const chain = checkSchema({
        foo: {
          isLength: {
            options: { min: 1 },
            errorMessage: 'fail'
          }
        }
      })[0];

      const validator = chain._context.validators[0];
      expect(validator)
        .to.have.property('options')
        .and.to.eql([{ min: 1 }]);

      expect(validator).to.have.property('message', 'fail');
    });

    it('adds validators with multiple options', () => {
      const chain = checkSchema({
        foo: {
          isLength: {
            options: ['foo', 'bar']
          }
        }
      })[0];

      const validator = chain._context.validators[0];
      expect(validator)
        .to.have.property('options')
        .and.to.eql(['foo', 'bar']);
    });

    it('makes it optional', () => {
      const chain = checkSchema({
        foo: {
          optional: true
        }
      })[0];

      expect(chain._context)
        .to.have.property('optional')
        .and.to.eql({});
    });
  });
});