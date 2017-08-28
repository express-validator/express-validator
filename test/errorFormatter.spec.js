const expect = require('chai').expect;
const expressValidator = require('..');

describe('Legacy: Error formatting', () => {
  it('returns object { msg, value, param, location } by default', () => {
    const req = {
      headers: { int: 'asd' }
    };

    expressValidator()(req, {}, () => {});
    req.checkHeaders('int').isInt();

    return req.getValidationResult().then(result => {
      expect(result.mapped().int).to.eql({
        location: 'headers',
        param: 'int',
        value: 'asd',
        msg: 'Invalid value'
      });
    });
  });

  it('returns custom object with errorFormatter middleware option', () => {
    const req = {
      headers: { int: 'asd' }
    };

    expressValidator({
      errorFormatter: (param, msg, value, location) => ({
        location,
        param,
        value,
        msg: 'Imma real cool'
      })
    })(req, {}, () => {});

    req.checkHeaders('int').isInt();

    return req.getValidationResult().then(result => {
      expect(result.mapped().int).to.eql({
        location: 'headers',
        param: 'int',
        value: 'asd',
        msg: 'Imma real cool'
      });
    });
  });
});