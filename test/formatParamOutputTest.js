var chai = require('chai');
var expect = chai.expect;
var formatParamOutput = require('../index').utils.formatParamOutput;

describe('#formatParamOutput()', function() {
  it('should correct return formatted string if all elements in array are strings', function() {
    expect(formatParamOutput(['hey', 'yo', 'hello'])).to.equal('hey.yo.hello');
  });

  it('should return a string with integers in brackets', function() {
    expect(formatParamOutput(['hey', 'yo', '0', 'hello'])).to.equal('hey.yo[0].hello');
    expect(formatParamOutput(['hey', 'yo', 0, 'hello'])).to.equal('hey.yo[0].hello');
    expect(formatParamOutput(['hey', 'yo', 0, 0, 'hello'])).to.equal('hey.yo[0][0].hello');
    expect(formatParamOutput(['hey', 'yo', 2342342, 'hello'])).to.equal('hey.yo[2342342].hello');
    expect(formatParamOutput(['hey', 'yo', '2342342', 'hello'])).to.equal('hey.yo[2342342].hello');
    expect(formatParamOutput(['hey', 'yo', '234ALPHA2342', 'hello'])).to.not.equal('hey.yo[234ALPHA2342].hello');
    expect(formatParamOutput(['hey', 'yo', 'hello', 0])).to.equal('hey.yo.hello[0]');
    expect(formatParamOutput(['hey', 'yo', 'hello', 0, 0])).to.equal('hey.yo.hello[0][0]');
    expect(formatParamOutput(['hey', 'yo', 0, 'hello', 0, 0])).to.equal('hey.yo[0].hello[0][0]');
  });

  it('should return the original param if not an array', function() {
    expect(formatParamOutput('yo')).to.equal('yo');
  });
});