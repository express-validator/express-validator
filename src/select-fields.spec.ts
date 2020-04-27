import { selectFields } from './select-fields';

it('selects single field from single location', () => {
  const req = { cookies: { foo: 'bar' } };
  const instances = selectFields(req, ['foo'], ['cookies']);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toEqual({
    location: 'cookies',
    path: 'foo',
    originalPath: 'foo',
    value: 'bar',
    originalValue: 'bar',
  });
});

it('selects multiple fields from single location', () => {
  const req = { cookies: { foo: 'bar', baz: 'qux' } };
  const instances = selectFields(req, ['foo', 'baz'], ['cookies']);

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

it('selects single field from multiple locations', () => {
  const req = {
    cookies: { foo: 'bar' },
    params: {},
  };
  const instances = selectFields(req, ['foo'], ['cookies', 'params']);

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

it('selects multiple fields from multiple locations', () => {
  const req = {
    cookies: { foo: 'bar' },
    params: { baz: 'qux' },
  };
  const instances = selectFields(req, ['foo', 'baz'], ['cookies', 'params']);

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

it('selects nested key with dot-notation', () => {
  const req = {
    body: { foo: { bar: true } },
  };
  const instances = selectFields(req, ['foo.bar'], ['body']);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    location: 'body',
    path: 'foo.bar',
    value: true,
  });
});

it('selects fields with special chars', () => {
  const req = {
    body: { 'http://foo.com': true },
  };
  const instances = selectFields(req, ['["http://foo.com"]'], ['body']);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    location: 'body',
    path: '["http://foo.com"]',
    value: true,
  });
});

it('selects array index with square brackets notation', () => {
  const req = {
    query: { foo: ['bar', 'baz'] },
  };
  const instances = selectFields(req, ['foo[1]'], ['query']);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    location: 'query',
    path: 'foo[1]',
    value: 'baz',
  });
});

it('selects from headers using lowercase', () => {
  const req = {
    headers: { 'content-type': 'application/json' },
  };
  const instances = selectFields(req, ['Content-Type'], ['headers']);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    location: 'headers',
    path: 'content-type',
    originalPath: 'Content-Type',
    value: 'application/json',
  });
});

it('selects whole location when path is empty', () => {
  const req = {
    body: 'shake it, shake it!',
  };
  const instances = selectFields(req, [''], ['body']);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    location: 'body',
    path: '',
    originalPath: '',
    value: 'shake it, shake it!',
  });
});

it('deduplicates field instances', () => {
  const req = {
    body: {
      foo: [{ a: 123, b: 456 }],
    },
  };

  const instances = selectFields(req, ['*[0].*', 'foo.*.b'], ['body']);

  expect(instances).toHaveLength(2);
  expect(instances[0]).toMatchObject({
    location: 'body',
    path: 'foo[0].a',
    value: 123,
  });
  expect(instances[1]).toMatchObject({
    location: 'body',
    path: 'foo[0].b',
    value: 456,
  });
});

describe('wildcard', () => {
  it('selects all shallow instances of a key', () => {
    const req = {
      query: { foo: ['bar', 'baz'] },
    };
    const instances = selectFields(req, ['foo.*'], ['query']);

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

  it('selects all shallow instances when key is just the wildcard', () => {
    const req = {
      body: ['bar', 'baz'],
    };
    const instances = selectFields(req, ['*'], ['body']);

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

  it('selects nothing if wildcard position does not exist', () => {
    const req = {
      query: { foo: 'bar' },
    };
    const instances = selectFields(req, ['foo.*.baz'], ['query']);

    expect(instances).toHaveLength(0);
  });
});
