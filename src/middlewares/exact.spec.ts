import { body, check } from './validation-chain-builders';
import { checkExact } from './exact';
import { checkSchema } from './schema';

it.each([
  ['single chain', check('banana')],
  ['array of chains', [check('banana'), check('apple')]],
  [
    'mixed array of chains and array of chains',
    [check('banana'), check('apple'), checkSchema({ pear: {} })],
  ],
])('finds unknown fields given a %s', async (_description, chains) => {
  const req = {
    body: { banana: true },
    query: { orange: 1 },
  };
  const result = await checkExact(chains).run(req);
  const errors = result.array();
  expect(errors).toHaveLength(1);
  expect(errors[0]).toMatchObject({
    type: 'unknown_fields',
    msg: 'Unknown field(s)',
    fields: [{ location: 'query', path: 'orange', value: 1 }],
  });
});

it('finds unknown fields from previously ran chains', async () => {
  const req = { query: { banana: 1, apple: 'red' } };
  await check('banana').run(req);
  const result = await checkExact().run(req);
  const errors = result.array();
  expect(errors).toHaveLength(1);
  expect(errors[0]).toMatchObject({
    type: 'unknown_fields',
    msg: 'Unknown field(s)',
    fields: [{ location: 'query', path: 'apple', value: 'red' }],
  });
});

it('finds unknown fields only from the specified locations', async () => {
  const req = {
    body: { banana: 1 },
    headers: { apple: 'green' },
  };
  const result = await checkExact([], { locations: ['headers'] }).run(req);
  const errors = result.array();
  expect(errors).toHaveLength(1);
  expect(errors[0]).toMatchObject({
    type: 'unknown_fields',
    fields: [{ location: 'headers', path: 'apple', value: 'green' }],
  });
});

it('finds unknown fields by default only from body, params and query', async () => {
  const req = {
    body: { banana: 1 },
    cookies: { apple: 2 },
    headers: { pear: 3 },
    params: { orange: 4 },
    query: { melon: 5 },
  };
  const result = await checkExact().run(req);
  const errors = result.array();
  expect(errors).toHaveLength(1);
  expect(errors[0]).toMatchObject({
    type: 'unknown_fields',
    fields: [
      { location: 'body', path: 'banana', value: 1 },
      { location: 'params', path: 'orange', value: 4 },
      { location: 'query', path: 'melon', value: 5 },
    ],
  });
});

it('only adds an error if there are unknown fields', async () => {
  const req = {
    body: { banana: 1 },
    params: { apple: true },
  };
  const result = await checkExact([check('banana'), check('apple')]).run(req);
  expect(result.isEmpty()).toBe(true);
});

it('works as a middleware', done => {
  const req = {};
  checkExact([])(req, {}, () => {
    done();
  });
});

describe('wildcard field validation', () => {
  it('detects unknown nested fields when wildcard parent and specific sub-paths are both declared', async () => {
    // body('*') validates each array element, body('*.id') and body('*.qty') declare specific sub-fields.
    // A field like 'wrong' nested inside an array element should be flagged as unknown.
    const req = {
      body: [
        { id: 1, qty: 100 },
        { id: 2, wrong: 1, qty: 100 },
      ],
    };
    const result = await checkExact([
      body().isArray(),
      body('*').isObject(),
      body('*.id').isInt(),
      body('*.qty').isInt(),
    ]).run(req);
    const errors = result.array();
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      type: 'unknown_fields',
      fields: [{ path: '[1].wrong', value: 1, location: 'body' }],
    });
  });

  it('does not flag unknown fields when only wildcard parent is declared (no specific sub-paths)', async () => {
    // When body('*') is used without any specific sub-paths, the wildcard fully covers all elements.
    const req = {
      body: [{ id: 1, qty: 100 }],
    };
    const result = await checkExact([body('*').isObject()]).run(req);
    expect(result.isEmpty()).toBe(true);
  });

  it('detects unknown fields using checkSchema with wildcard paths', async () => {
    const req = {
      body: [
        { id: 1, qty: 100 },
        { id: 2, extra: 'bad', qty: 100 },
      ],
    };
    const result = await checkExact(
      checkSchema({
        '*.id': { in: ['body'], isInt: true },
        '*.qty': { in: ['body'], isInt: true },
      }),
    ).run(req);
    const errors = result.array();
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      type: 'unknown_fields',
      fields: [{ path: '[1].extra', value: 'bad', location: 'body' }],
    });
  });

  it('allows all array element fields when no sub-paths are declared for the wildcard', async () => {
    // No sub-paths for '*': everything inside each element is implicitly covered.
    const req = {
      body: [{ id: 1, qty: 100, extra: 'any' }],
    };
    const result = await checkExact([body('*')]).run(req);
    expect(result.isEmpty()).toBe(true);
  });
});
