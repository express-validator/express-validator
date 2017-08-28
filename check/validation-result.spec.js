const { expect } = require('chai');
const validationResult = require('./validation-result');

describe('check: validationResult', () => {
  const allErrors = [
    { param: 'foo', msg: 'blabla' },
    { param: 'foo', msg: 'watwat' },
    { param: 'bar', msg: 'yay' }
  ];

  describe('.isEmpty()', () => {
    it('returns whether there are no errors', () => {
      let result = validationResult({ _validationErrors: [] });
      expect(result.isEmpty()).to.be.true;

      result = validationResult({ _validationErrors: allErrors });
      expect(result.isEmpty()).to.be.false;
    });
  });

  describe('.array()', () => {
    it('returns whether there are no errors', () => {
      const result = validationResult({ _validationErrors: allErrors });

      expect(result.array())
        .to.have.length(3)
        .and.to.eql(allErrors);
    });

    it('returns only the first error for each field if { onlyFirstError: true }', () => {
      const result = validationResult({ _validationErrors: allErrors });

      const errors = result.array({ onlyFirstError: true });
      expect(errors).to.have.length(2);
      expect(errors).to.deep.include({
        param: 'foo',
        msg: 'blabla'
      });
      expect(errors).to.deep.include({
        param: 'bar',
        msg: 'yay'
      });
    });

    it('formats using formatter passed via .formatWith()', () => {
      const result = validationResult({ _validationErrors: allErrors }).formatWith(error => {
        return Object.assign({ code: 'foo' }, error);
      });

      let errors = result.array();
      expect(errors[0]).to.have.property('code', 'foo');
      expect(errors[1]).to.have.property('code', 'foo');
      expect(errors[2]).to.have.property('code', 'foo');

      errors = result.array({ onlyFirstError: true });
      expect(errors[0]).to.have.property('code', 'foo');
      expect(errors[1]).to.have.property('code', 'foo');
    });
  });

  describe('.mapped()', () => {
    it('returns an object of errors of first error of each field', () => {
      const result = validationResult({ _validationErrors: allErrors });
      expect(result.mapped()).to.eql({
        foo: { param: 'foo', msg: 'blabla' },
        bar: { param: 'bar', msg: 'yay' }
      });
    });

    it('formats using formatter passed via .formatWith()', () => {
      const result = validationResult({ _validationErrors: allErrors }).formatWith(error => {
        return Object.assign({ code: 'bar' }, error);
      });

      expect(result.mapped()).to.eql({
        foo: { param: 'foo', msg: 'blabla', code: 'bar' },
        bar: { param: 'bar', msg: 'yay', code: 'bar' }
      });
    });
  });

  describe('.throw()', () => {
    it('throws when there are errors', () => {
      const result = validationResult({
        _validationErrors: [{}]
      });
      expect(result.throw).to.throw(Error);
    });

    it('does not throw when there are no errors', () => {
      const result = validationResult({ _validationErrors: [] });
      expect(result.throw).to.not.throw(Error);
    });

    it('throws errors decorated with the result API', done => {
      const result = validationResult({ _validationErrors: [{}] });
      try {
        result.throw();
        done(new Error('no errors thrown'));
      } catch (e) {
        expect(e).to.respondTo('mapped');
        expect(e).to.respondTo('array');
        done();
      }
    });

    it('passes previous formatter to the thrown error', done => {
      const result = validationResult({ _validationErrors: allErrors }).formatWith(error => {
        return Object.assign({ code: 'foo' }, error);
      });

      try {
        result.throw();
        done(new Error('no errors thrown'));
      } catch (e) {
        expect(e.array()).to.have.deep.property('[0].code', 'foo');
        done();
      }
    });
  });
});