const { expect } = require('chai');
const createCheckAPI = require('./create-check-api');

describe('check: createCheckAPI', () => {
  describe('on each field', () => {
    it('adds a custom validator', () => {
      const checkSchema = createCheckAPI({
        customValidators: {
          isFoo: (value) => value === 'foo'
        }
      }).checkSchema;
      const chain = checkSchema({
        foo: {
          errorMessage: 'bla',
          isFoo: true
        }
      })[0];

      // errorMessage is not a validator
      expect(chain._context)
        .to.have.property('validators')
        .and.to.have.lengthOf(1);
    });
    it('adds a custom sanitizer', () => {
      const checkSchema = createCheckAPI({
        customSanitizers: {
          toFoo: () => 'foo'
        }
      }).checkSchema;
      const chain = checkSchema({
        foo: {
          errorMessage: 'bla',
          toFoo: true
        }
      })[0];

      // errorMessage is not a sanitizer
      expect(chain._context)
        .to.have.property('sanitizers')
        .and.to.have.lengthOf(1);
    });
  });
});
