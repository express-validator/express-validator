import { check } from './middlewares/validation-chain-builders';
import { matchedData } from './matched-data';
import { oneOf } from './middlewares/one-of';

it('works if no validation or sanitization chains ran', () => {
  expect(matchedData({})).toEqual({});
});

it('includes only valid, non-optional data by default', done => {
  const req = {
    headers: { foo: 'bla', bar: '123' },
  };

  const middleware = check(['foo', 'bar', 'baz']).optional().isInt();

  middleware(req, {}, () => {
    expect(matchedData(req)).toEqual({
      bar: '123',
    });

    done();
  });
});

it('includes data that was validated with wildcards', done => {
  const req = {
    headers: { foo: [1, 2, 3] },
    query: { bar: { baz: { qux: 4 } } },
  };

  check(['foo.*', '*.*.qux']).isInt()(req, {}, () => {
    expect(matchedData(req)).toEqual({
      foo: [1, 2, 3],
      bar: { baz: { qux: 4 } },
    });

    done();
  });
});

it('does not include valid data from invalid oneOf() chain group', done => {
  const req = {
    query: { foo: 'foo', bar: 123, baz: 'baz' },
  };

  oneOf([
    [check('foo').equals('foo'), check('bar').not().isInt()],
    [check('baz').equals('baz'), check('bar').isInt()],
  ])(req, {}, () => {
    expect(matchedData(req)).toEqual({
      bar: 123,
      baz: 'baz',
    });
    done();
  });
});

describe('when option includeOptionals is true', () => {
  it('returns object with optional data', done => {
    const req = {
      headers: { foo: 'bla', bar: '123' },
    };

    const middleware = check(['foo', 'bar', 'baz']).optional().isInt();

    middleware(req, {}, () => {
      const data = matchedData(req, { includeOptionals: true });
      expect(data).toHaveProperty('bar', '123');
      expect(data).toHaveProperty('baz');

      done();
    });
  });
});

describe('when option onlyValidData is false', () => {
  it('returns object with invalid data', done => {
    const req = {
      headers: { foo: 'bla', bar: '123' },
    };

    check(['foo', 'bar']).isInt()(req, {}, () => {
      const data = matchedData(req, { onlyValidData: false });
      expect(data).toEqual({
        foo: 'bla',
        bar: '123',
      });

      done();
    });
  });
});

describe('when option locations is defined', () => {
  it('gathers only data from the locations specified', done => {
    const req = {
      headers: { foo: 'bla' },
      params: { bar: 123 },
      query: { baz: true },
    };

    check(['foo', 'bar', 'baz'])(req, {}, () => {
      const data = matchedData(req, {
        locations: ['params', 'query'],
      });

      expect(data).toEqual({
        bar: 123,
        baz: true,
      });

      done();
    });
  });
});
