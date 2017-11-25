const { expect } = require('chai');
const validationResult = require('./validation-result');

describe('check: validationResult', () => {
  const allErrors = [
    { param: 'foo', msg: 'blabla' },
    { param: 'foo', msg: 'watwat' },
    { param: 'bar', msg: 'yay' }
  ];

  it('works even though no validators ran', () => {
    const result = validationResult({});
    expect(result.throw).not.to.throw(Error);
    expect(result.mapped()).to.eql({});
    expect(result.array()).to.eql([]);
    expect(result.isEmpty()).to.be.true;
  });

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

    it('formats using formatter passed via .withDefaults()', () => {
      const resultWithDefaults = validationResult.withDefaults({
        formatter: error => {
          return Object.assign({ code: 'foo' }, error);
        }
      });
      const result = resultWithDefaults({ _validationErrors: allErrors });

      let errors = result.array();
      expect(errors[0]).to.have.property('code', 'foo');
      expect(errors[1]).to.have.property('code', 'foo');
      expect(errors[2]).to.have.property('code', 'foo');

      errors = result.array({ onlyFirstError: true });
      expect(errors[0]).to.have.property('code', 'foo');
      expect(errors[1]).to.have.property('code', 'foo');
    });

    it('formats using formatter passed via .formatWith(), although a formatter passed via .withDefaults() is set', () => {
      const resultWithDefaults = validationResult.withDefaults({
        formatter: error => {
          return Object.assign({ code: 'bar' }, error);
        }
      });
      const result = resultWithDefaults({ _validationErrors: allErrors }).formatWith(error => {
        return Object.assign({ code: 'foo' }, error);
      });;

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

    it('formats using formatter passed via .withDefaults()', () => {
      const resultWithDefaults = validationResult.withDefaults({
        formatter: error => {
          return Object.assign({ code: 'bar' }, error);
        }
      });
      const result = resultWithDefaults({ _validationErrors: allErrors });

      expect(result.mapped()).to.eql({
        foo: { param: 'foo', msg: 'blabla', code: 'bar' },
        bar: { param: 'bar', msg: 'yay', code: 'bar' }
      });
    });

    it('formats using formatter passed via .formatWith(), although a formatter passed via .withDefaults() is set', () => {
      const resultWithDefaults = validationResult.withDefaults(error => {
        return Object.assign({ code: 'baz' }, error);
      });
      const result = resultWithDefaults({ _validationErrors: allErrors }).formatWith(error => {
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

    it('passes formatter passed via .withDefaults()', done => {
      const resultWithDefaults = validationResult.withDefaults({
        formatter: error => {
          return Object.assign({ code: 'foo' }, error);
        }
      });
      const result = resultWithDefaults({ _validationErrors: allErrors });

      try {
        result.throw();
        done(new Error('no errors thrown'));
      } catch (e) {
        expect(e.array()).to.have.deep.property('[0].code', 'foo');
        done();
      }
    });

    it('passes formatter passed via .formatWith(), athough a formatter passed via .withDefaults() is set', done => {
      const resultWithDefaults = validationResult.withDefaults({
        formatter: error => {
          return Object.assign({ code: 'bar' }, error);
        }
      });
      const result = resultWithDefaults({ _validationErrors: allErrors }).formatWith(error => {
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

  describe('.withDefaults()', () => {
    it('uses default formatter if options are not supplied', () => {
      const resultWithDefaults = validationResult.withDefaults();
      const result = resultWithDefaults({ _validationErrors: allErrors });

      expect(result.mapped()).to.eql({
        foo: { param: 'foo', msg: 'blabla' },
        bar: { param: 'bar', msg: 'yay' }
      });
    });

    it('creates a separate validationResult instance', () => {
      const resultWithDefaults1 = validationResult.withDefaults({
        formatter: error => {
          return Object.assign({ code: 'bar' }, error);
        }
      });
      const result1 = resultWithDefaults1({ _validationErrors: allErrors });

      const resultWithDefaults2 = validationResult.withDefaults({
        formatter: error => {
          return Object.assign({ code: 'baz' }, error);
        }
      });
      const result2 = resultWithDefaults2({ _validationErrors: allErrors });

      expect(result1.mapped()).to.eql({
        foo: { param: 'foo', msg: 'blabla', code: 'bar' },
        bar: { param: 'bar', msg: 'yay', code: 'bar' }
      });

      expect(result2.mapped()).to.eql({
        foo: { param: 'foo', msg: 'blabla', code: 'baz' },
        bar: { param: 'bar', msg: 'yay', code: 'baz' }
      });
    });
  });
});