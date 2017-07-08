var chai = require('chai');
var expect = chai.expect;

describe('#validatorReturn()', function() {
  before(function() {
    delete require.cache[require.resolve('../lib/express_validator')];
  });

  it('should not throw on nil return', function() {
    var validator = require('../lib/express_validator')({
      customValidators: {
        testNull: function() {
          return null;
        },
        testUndefined: function() {
          return undefined;
        }
      }
    });

    var req = {
      body: {
        testParamNull: 1,
        testParamUndefined: 2
      }
    };

    validator(req, {}, function() {});

    var verifyNull = function() {
      req.check('testParamNull', 'Default Message').testNull()
    }

    var verifyUndefined = function() {
      req.check('testParamUndefined', 'Default Message').testUndefined()
    }

    expect(verifyNull).to.not.throw();
    expect(verifyUndefined).to.not.throw();

    expect(req.validationErrors()).to.deep.equal([
      { param: 'testParamNull', msg: 'Default Message', value: 1 },
      { param: 'testParamUndefined', msg: 'Default Message', value: 2 }
    ]);

  });
});

