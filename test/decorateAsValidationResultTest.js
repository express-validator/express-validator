var chai = require('chai');
var expect = chai.expect;
var decorateAsValidationResult = require('../index').utils.decorateAsValidationResult;

describe('#decorateAsValidationResult()', function() {
  beforeEach(function() {
    this.result = decorateAsValidationResult({}, [{
      param: 'foo',
      message: '1'
    }, {
      param: 'foo',
      message: '2'
    }, {
      param: 'bar',
      message: '1'
    }]);
  });

  it('returns original object', function() {
    var obj = {};
    expect(decorateAsValidationResult(obj, [])).to.equal(obj);
  });

  describe('adds #isEmpty() which', function() {
    it('should return false for when there is at least one error', function() {
      expect(decorateAsValidationResult({}, [{}]).isEmpty()).to.be.false;
    });

    it('should return true for when there are no errors', function() {
      expect(decorateAsValidationResult({}, []).isEmpty()).to.be.true;
    });
  });

  describe('adds #array() which', function() {
    it('should return all errors when firstErrorOnly is not enabled', function() {
      expect(this.result.array()).to.have.length(3);
    });

    it('should return only first error of each param when firstErrorOnly is enabled', function() {
      var errors = this.result.useFirstErrorOnly().array();
      expect(errors).to.have.length(2);
      expect(errors).to.include({ param: 'foo', message: '1' });
      expect(errors).to.include({ param: 'bar', message: '1' });
      expect(errors).to.not.include({ param: 'foo', message: '2' });
    });
  });

  describe('adds #mapped() which', function() {
    it('should return last error for each param when firstErrorOnly is disabled', function() {
      expect(this.result.mapped()).to.eql({
        foo: { param: 'foo', message: '2' },
        bar: { param: 'bar', message: '1' }
      });
    });

    it('should return first error for each param when firstErrorOnly is enabled', function() {
      expect(this.result.useFirstErrorOnly().mapped()).to.eql({
        foo: { param: 'foo', message: '1' },
        bar: { param: 'bar', message: '1' }
      });
    });
  });

  describe('adds #useFirstErrorOnly() which', function() {
    it('should return the result object itself', function() {
      expect(this.result.useFirstErrorOnly()).to.equal(this.result);
    });
  });

  describe('adds #throw() which', function() {
    describe('there are errors', function() {
      it('should throw error object', function() {
        expect(this.result.throw).to.throw(Error);
      });

      it('should throw decorated object', function() {
        try {
          this.result.throw();
        } catch (e) {
          expect(e.array()).to.eql(this.result.array());
        }
      });
    });

    describe('there are no errors', function() {
      it('should not do anything', function() {
        var result = decorateAsValidationResult({}, []);
        result.throw();
      });
    });
  });
});