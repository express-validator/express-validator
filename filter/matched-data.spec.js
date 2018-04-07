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

  it('does not double sanitize data', () => {
    const req = {
      body: { text: '<tag>' }
    };

    return check('text').escape()(req, {}, () => {}).then(() => {
      const data = matchedData(req);
      expect(data).to.eql({ text: '&lt;tag&gt;' });
    });
  });

  describe('with oneOf()', () => {
    it('includes data only from the successful chains by default', () => {
      const req = {
        headers: { foo: 'foo', bar: '123', baz: 'baz', qux: 456 }
      };

      return oneOf([
        check('foo').isInt(),
        check('bar').isInt(),
        check('qux').isInt()
      ])(req, {}, () => {}).then(() => {
        const data = matchedData(req);
        expect(data).to.eql({ bar: '123', qux: 456 });
      });
    });

    it('includes data only from successful subchains by default', () => {
      const req = {
        headers: { foo: 'foo', bar: '123', baz: 'baz', qux: 456 }
      };

      return oneOf([
        [
          check('foo').custom(val => val === 'foo'),
          check('bar').not().isInt()
        ], [
          check('bar').isInt(),
          check('baz').custom(val => val === 'baz')
        ],
        check('qux').isInt()
      ])(req, {}, () => {}).then(() => {
        const data = matchedData(req);
        expect(data).to.eql({ bar: '123', baz: 'baz', qux: 456 });
      });
    });

    it('works with multiple oneOf()s', () => {
      const req = {
        headers: { foo: 'foo', bar: '123', baz: 'baz' }
      };

      return Promise.all([
        oneOf([ check('bar').isInt(), check('baz').isInt() ])(req, {}, () => {}),
        oneOf([ check('bar').not().isInt(), check('baz').not().isInt() ])(req, {}, () => {})
      ]).then(() => {
        const data = matchedData(req);
        expect(data).to.eql({ bar: '123', baz: 'baz' });
      });
    });
  });

  describe('when option onlyValidData is set to false', () => {
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

  describe('when option locations is passed', () => {
    it('gathers only data from the locations specified in the array', () => {
      const req = {
        query: { foo: '123', bar: 'abc' },
        body: { baz: '234' }
      };

      return check(['foo', 'bar', 'baz']).isInt()(req, {}, () => {}).then(() => {
        const data = matchedData(req, { locations: ['body'] });

        expect(data).to.eql({
          baz: '234'
        });
      });
    });

    it('gathers data from all locations if empty array', () => {
      const req = {
        query: { foo: '123', bar: 'abc' },
        body: { baz: '234' }
      };

      return check(['foo', 'bar', 'baz']).isInt()(req, {}, () => {}).then(() => {
        const data = matchedData(req, {
          locations: []
        });

        expect(data).to.eql({
          foo: '123',
          baz: '234'
        });
      });
    });

    it('gathers data from all locations if not an array', () => {
      const req = {
        query: { foo: '123', bar: 'abc' },
        body: { baz: '234' }
      };

      return check(['foo', 'bar', 'baz']).isInt()(req, {}, () => {}).then(() => {
        const data = matchedData(req, {
          locations: false
        });

        expect(data).to.eql({
          foo: '123',
          baz: '234'
        });
      });
    });
  });
});
