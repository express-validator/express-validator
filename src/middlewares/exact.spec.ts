import { checkExact } from './exact';
import { checkSchema } from './schema';
import { check } from './validation-chain-builders';
import { oneOf } from './one-of';

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

it('works when used along with oneOf', async () => {
  const req = {
    body: {
      recognized: 'A',
      unrecognized: 'B',
    },
  };

  await check('recognized').isString().run(req);
  await oneOf([check('unrecognized').isString(), check('unrecognizedOther').isString()]).run(req);
  const result = await checkExact().run(req);
  expect(result.context.errors).toHaveLength(0);
});

it('works when multiple instances of oneOf are matched', async () => {
  const req = {
    body: {
      recognized: 'A',
      unrecognized: 'B',
      unrecognizedOther: 'C',
    },
  };

  await check('recognized').isString().run(req);
  await oneOf([check('unrecognized').isString(), check('unrecognizedOther').isString()]).run(req);
  const result = await checkExact().run(req);
  expect(result.context.errors).toHaveLength(0);
});

