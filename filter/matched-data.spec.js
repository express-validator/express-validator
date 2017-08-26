const { expect } = require('chai');
const { check, oneOf } = require('../check');
const { matchedData } = require('./');

describe('filter: matchedData', () => {
  it('includes only valid data in the request', () => {
    const req = {
      query: { foo: '123', bar: 'abc', baz: 'def' },
      body: { foo: 'abc' }
    };

    return check(['foo', 'bar']).isInt()(req, {}, () => {}).then(() => {
      const data = matchedData(req);
      expect(data).to.eql({ foo: '123' });
    });
  });

  it('sets paths properly even when using wildcards', () => {
    const req = {
      body: { foo: [10, 20, 30] },
      query: { bar: { baz: { qux: 123 } } }
    };

    return check(['foo.*', '*.*.qux']).isInt()(req, {}, () => {}).then(() => {
      const data = matchedData(req);

      expect(data).to.eql({
        foo: [10, 20, 30],
        bar: { baz: { qux: 123 } }
      });
    });
  });

  describe('when { onlyValidData: false } flag is passed', () => {
    it('returns object with all data validated in the request', () => {
      const req = {
        query: { foo: '123', bar: 'abc', baz: 'def' }
      };

      return check(['foo', 'bar']).isInt()(req, {}, () => {}).then(() => {
        const data = matchedData(req, { onlyValidData: false });

        expect(data).to.eql({
          foo: '123',
          bar: 'abc'
        });
      });
    });

    it('includes data from every chain in oneOf', () => {
      const req = {
        headers: { foo: 'foo', bar: 'bar', baz: 'baz' }
      };

      return oneOf([
        check('foo').isInt(),
        check('bar').isInt()
      ])(req, {}, () => {}).then(() => {
        const data = matchedData(req, { onlyValidData: false });

        expect(data).to.eql({
          foo: 'foo',
          bar: 'bar'
        });
      });
    });
  });
});