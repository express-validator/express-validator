const expect = require('chai').expect;
const expressValidator = require('..');

describe('Legacy: .optional()', () => {
  it('ignores validation if the key does not exist in the request', () => {
    const req = {
      query: {}
    };

    expressValidator()(req, {}, () => {});
    req.checkQuery('int').optional().isInt();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.eql({});
    });
  });

  it('ignores validation if the key is falsy with { checkFalsy: true }', () => {
    const req = {
      query: { upper: '' }
    };

    expressValidator()(req, {}, () => {});
    req.checkQuery('upper').optional({ checkFalsy: true }).isUppercase();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.eql({});
    });
  });

  it('ignores validation in schemas, independent of the position of the key', () => {
    const req = {
      query: { upper: 'ASD' }
    };

    expressValidator()(req, {}, () => {});
    req.checkQuery({
      int: {
        isInt: true,
        optional: true
      },
      upper: {
        isUppercase: true,
        optional: true
      },
      none: {
        optional: true
      }
    });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.eql({});
    });
  });
});