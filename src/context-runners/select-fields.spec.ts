import { Context } from '../context';
import { SelectFields } from './select-fields';

let runner: SelectFields;
beforeEach(() => {
  runner = new SelectFields();
});

it('selects single field from single location', async () => {
  const req = { cookies: { foo: 'bar' } };
  const context = new Context(['foo'], ['cookies']);
  const instances = await runner.run(req, context);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toEqual({
    location: 'cookies',
    path: 'foo',
    originalPath: 'foo',
    value: 'bar',
    originalValue: 'bar',
  });
});

it('selects multiple fields from single location', async () => {
  const req = { cookies: { foo: 'bar', baz: 'qux' } };
  const context = new Context(['foo', 'baz'], ['cookies']);
  const instances = await runner.run(req, context);

  expect(instances).toHaveLength(2);
  expect(instances[0]).toMatchObject({
    location: 'cookies',
    path: 'foo',
    value: 'bar',
  });
  expect(instances[1]).toMatchObject({
    location: 'cookies',
    path: 'baz',
    value: 'qux',
  });
});

it('selects single field from multiple locations', async () => {
  const req = {
    cookies: { foo: 'bar' },
    params: {},
  };
  const context = new Context(['foo'], ['cookies', 'params']);
  const instances = await runner.run(req, context);

  expect(instances).toHaveLength(2);
  expect(instances[0]).toMatchObject({
    location: 'cookies',
    path: 'foo',
    value: 'bar',
  });
  expect(instances[1]).toMatchObject({
    location: 'params',
    path: 'foo',
    value: undefined,
  });
});

it('selects multiple fields from multiple locations', async () => {
  const req = {
    cookies: { foo: 'bar' },
    params: { baz: 'qux' },
  };
  const context = new Context(['foo', 'baz'], ['cookies', 'params']);
  const instances = await runner.run(req, context);

  expect(instances).toHaveLength(4);
  expect(instances[0]).toMatchObject({
    location: 'cookies',
    path: 'foo',
    value: 'bar',
  });
  expect(instances[1]).toMatchObject({
    location: 'params',
    path: 'foo',
    value: undefined,
  });
  expect(instances[2]).toMatchObject({
    location: 'cookies',
    path: 'baz',
    value: undefined,
  });
  expect(instances[3]).toMatchObject({
    location: 'params',
    path: 'baz',
    value: 'qux',
  });
});

it('selects nested key with dot-notation', async () => {
  const req = {
    body: { foo: { bar: true } },
  };
  const context = new Context(['foo.bar'], ['body']);
  const instances = await runner.run(req, context);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    location: 'body',
    path: 'foo.bar',
    value: true,
  });
});

it('selects array index with square brackets notation', async () => {
  const req = {
    query: { foo: ['bar', 'baz'] },
  };
  const context = new Context(['foo[1]'], ['query']);
  const instances = await runner.run(req, context);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    location: 'query',
    path: 'foo[1]',
    value: 'baz',
  });
});

it('selects from headers using lowercase', async () => {
  const req = {
    headers: { 'content-type': 'application/json' },
  };
  const context = new Context(['Content-Type'], ['headers']);
  const instances = await runner.run(req, context);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    location: 'headers',
    path: 'content-type',
    originalPath: 'Content-Type',
    value: 'application/json',
  });
});

it('selects whole location when path is empty', async () => {
  const req = {
    body: 'shake it, shake it!',
  };
  const context = new Context([''], ['body']);
  const instances = await runner.run(req, context);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    location: 'body',
    path: '',
    originalPath: '',
    value: 'shake it, shake it!',
  });
});

describe('wildcard', () => {
  it('selects all shallow instances of a key', async () => {
    const req = {
      query: { foo: ['bar', 'baz'] },
    };
    const context = new Context(['foo.*'], ['query']);
    const instances = await runner.run(req, context);

    expect(instances).toHaveLength(2);
    expect(instances[0]).toMatchObject({
      location: 'query',
      path: 'foo[0]',
      originalPath: 'foo.*',
      value: 'bar',
    });
    expect(instances[1]).toMatchObject({
      location: 'query',
      path: 'foo[1]',
      originalPath: 'foo.*',
      value: 'baz',
    });
  });

  it('selects all shallow instances when key is just the wildcard', async () => {
    const req = {
      body: ['bar', 'baz'],
    };
    const context = new Context(['*'], ['body']);
    const instances = await runner.run(req, context);

    expect(instances).toHaveLength(2);
    expect(instances[0]).toMatchObject({
      location: 'body',
      path: '[0]',
      originalPath: '*',
      value: 'bar',
    });
    expect(instances[1]).toMatchObject({
      location: 'body',
      path: '[1]',
      originalPath: '*',
      value: 'baz',
    });
  });

  it('selects nothing if wildcard position does not exist', async () => {
    const req = {
      query: { foo: 'bar' },
    };
    const context = new Context(['foo.*.baz'], ['query']);
    const instances = await runner.run(req, context);

    expect(instances).toHaveLength(0);
  });
});
