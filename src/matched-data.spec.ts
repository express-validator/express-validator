import { body, check } from './middlewares/validation-chain-builders';
import { matchedData } from './matched-data';
import { oneOf } from './middlewares/one-of';
import { validationResult } from './validation-result';

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

describe('missing fields', () => {
  it.each(['never_that_field', 'nested.never_that_field'])(
    'omits absent valid field %s',
    async path => {
      const req = { body: { name: 'john' } };
      await check(path).not().exists().run(req);

      expect(validationResult(req).isEmpty()).toBe(true);
      expect(req.body).toStrictEqual({ name: 'john' });
      expect(matchedData(req)).toStrictEqual({});
    },
  );

  it('omits absent valid fields selected from a single location', async () => {
    const req = { body: {}, query: { field: 'unselected' } };
    await body('field').not().exists().run(req);

    expect(validationResult(req).isEmpty()).toBe(true);
    expect(matchedData(req)).not.toHaveProperty('field');
  });

  it.each([body, check])('preserves explicit undefined values (%p)', async build => {
    const req = { body: { field: undefined, nested: { field: undefined } } };
    await build(['field', 'nested.field']).not().exists().run(req);

    expect(validationResult(req).isEmpty()).toBe(true);
    expect(matchedData(req)).toStrictEqual(req.body);
  });

  it('preserves explicit undefined header values with case-insensitive selection', async () => {
    const req = { headers: { 'x-field': undefined } };
    await check('X-Field').not().exists().run(req);

    expect(matchedData(req)).toStrictEqual({ 'X-Field': undefined });
  });

  it('preserves values sanitized to undefined', async () => {
    const req = { body: { field: 'value' } };
    await check('field')
      .customSanitizer(() => undefined)
      .run(req);

    expect(req.body).toStrictEqual({ field: undefined });
    expect(matchedData(req)).toStrictEqual({ field: undefined });
  });

  it('includes defaults supplied for absent fields', async () => {
    const req = { body: {} };
    await body('field').default('value').run(req);

    expect(matchedData(req)).toStrictEqual({ field: 'value' });
  });

  it.each([undefined, 'value'])('preserves whole-body data (%p)', async value => {
    const req = { body: value };
    await body()
      .custom(() => true)
      .run(req);

    expect(matchedData(req)).toStrictEqual({ '': value });
  });

  it('preserves extraction from multiple locations', async () => {
    const req = { body: { field: 'body' }, query: { field: 'query' } };
    await check('field').isString().run(req);

    expect(matchedData(req)).toStrictEqual({ field: 'query' });
    expect(matchedData(req, { locations: ['body'] })).toStrictEqual({ field: 'body' });
  });

  it('includes absent invalid fields when onlyValidData is false', async () => {
    const req = { body: {} };
    await body('field').exists().run(req);

    expect(validationResult(req).isEmpty()).toBe(false);
    expect(matchedData(req)).toStrictEqual({});
    expect(matchedData(req, { onlyValidData: false })).toStrictEqual({ field: undefined });
  });

  it.each([{ includeOptionals: true }, { onlyValidData: false }])(
    'preserves explicit inclusion options (%p)',
    async options => {
      const req = { body: {} };
      await body('field').not().exists().run(req);

      expect(matchedData(req, options)).toStrictEqual({ field: undefined });
    },
  );

  it('preserves optional data in oneOf contexts', async () => {
    const req = { body: {} };
    await oneOf([body('field').optional().isInt()]).run(req);

    expect(matchedData(req)).toStrictEqual({ field: undefined });
  });

  it('preserves explicit undefined across locations in oneOf contexts', async () => {
    const req = { body: { field: undefined } };
    await oneOf([check('field').not().exists()]).run(req);

    expect(matchedData(req)).toStrictEqual({ field: undefined });
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
