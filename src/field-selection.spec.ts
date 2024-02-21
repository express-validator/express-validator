import { reconstructFieldPath, selectFields, selectUnknownFields } from './field-selection';

describe('selectFields()', () => {
  it('selects single field from single location', () => {
    const req = { cookies: { foo: 'bar' } };
    const instances = selectFields(req, ['foo'], ['cookies']);

    expect(instances).toHaveLength(1);
    expect(instances[0]).toEqual({
      location: 'cookies',
      path: 'foo',
      originalPath: 'foo',
      value: 'bar',
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

  it('selects inexistent properties', () => {
    const instances = selectFields({}, ['foo.bar.baz'], ['cookies']);

    expect(instances).toHaveLength(1);
    expect(instances[0]).toEqual({
      location: 'cookies',
      path: 'foo.bar.baz',
      originalPath: 'foo.bar.baz',
      value: undefined,
    });
  });

  it('does not select properties of primitives', () => {
    const req = {
      body: { foo: 1 },
    };
    const instances = selectFields(req, ['foo.toFixed'], ['body']);
    expect(instances).toHaveLength(0);
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

    it('selects field if its path is a wildcard', () => {
      const req = {
        query: { '*': 'foo' },
      };
      const instances = selectFields(req, ['*'], ['query']);

      expect(instances).toHaveLength(1);
      expect(instances[0]).toMatchObject({
        location: 'query',
        path: '*',
        originalPath: '*',
        value: 'foo',
      });
    });

    it('selects matching fields under wildcard branch', () => {
      const req = {
        query: { foo: { bar: { a: true }, baz: { a: false, b: 1 } } },
      };
      const instances = selectFields(req, ['foo.*.a'], ['query']);

      expect(instances).toHaveLength(2);
      expect(instances[0]).toMatchObject({
        location: 'query',
        path: 'foo.bar.a',
        originalPath: 'foo.*.a',
        value: true,
      });
      expect(instances[1]).toMatchObject({
        location: 'query',
        path: 'foo.baz.a',
        originalPath: 'foo.*.a',
        value: false,
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

  describe('globstar', () => {
    it('selects all leaves that match a leaf globstar', () => {
      const req = {
        query: { foo: { a: { b: { c: 1 } }, d: { e: 2 } } },
      };
      const instances = selectFields(req, ['foo.**'], ['query']);

      expect(instances).toHaveLength(2);
      expect(instances[0]).toMatchObject({
        location: 'query',
        path: 'foo.a.b.c',
        originalPath: 'foo.**',
        value: 1,
      });
      expect(instances[1]).toMatchObject({
        location: 'query',
        path: 'foo.d.e',
        originalPath: 'foo.**',
        value: 2,
      });
    });

    it('selects deeply nested matching fields under a globstar branch', () => {
      const req = {
        query: { foo: { a: { b: { bar: 1 } }, c: { bar: 2 } } },
      };
      const instances = selectFields(req, ['foo.**.bar'], ['query']);

      expect(instances).toHaveLength(2);
      expect(instances[0]).toMatchObject({
        location: 'query',
        path: 'foo.a.b.bar',
        originalPath: 'foo.**.bar',
        value: 1,
      });
      expect(instances[1]).toMatchObject({
        location: 'query',
        path: 'foo.c.bar',
        originalPath: 'foo.**.bar',
        value: 2,
      });
    });

    it('selects branch and leaf when both match a globstar selector', () => {
      const req = {
        query: { foo: { foo: 1 } },
      };
      const instances = selectFields(req, ['**.foo'], ['query']);

      expect(instances).toHaveLength(2);
      expect(instances[0]).toMatchObject({
        location: 'query',
        path: 'foo.foo',
        originalPath: '**.foo',
        value: 1,
      });
      expect(instances[1]).toMatchObject({
        location: 'query',
        path: 'foo',
        originalPath: '**.foo',
        value: { foo: 1 },
      });
    });

    it('selects field if its path is a globstar', () => {
      const req = {
        query: { '**': 'foo' },
      };
      const instances = selectFields(req, ['**'], ['query']);

      expect(instances).toHaveLength(1);
      expect(instances[0]).toMatchObject({
        location: 'query',
        path: '**',
        originalPath: '**',
        value: 'foo',
      });
    });
  });
});

describe('selectUnknownFields()', () => {
  it('selects top-level unknown fields', () => {
    const req = { body: { foo: 1, bar: 2, baz: 3 } };
    const instances = selectUnknownFields(req, ['foo', 'baz'], ['body']);
    expect(instances).toHaveLength(1);
    expect(instances[0]).toMatchObject({
      path: 'bar',
      value: 2,
      location: 'body',
    });
  });

  it('selects nested unknown fields', () => {
    const req = { body: { foo: { bar: 'hi', baz: 'hey' } } };
    const instances = selectUnknownFields(req, ['foo.bar'], ['body']);
    expect(instances).toHaveLength(1);
    expect(instances[0]).toMatchObject({
      path: 'foo.baz',
      value: 'hey',
      location: 'body',
    });
  });

  it('selects nested unknown fields under an array', () => {
    const req = { body: { foo: ['bar', 'baz'] } };
    const instances = selectUnknownFields(req, ['foo[0]'], ['body']);
    expect(instances).toHaveLength(1);
    expect(instances[0]).toMatchObject({
      path: 'foo[1]',
      value: 'baz',
      location: 'body',
    });
  });

  // This one seems controversial.
  // The nested property wouldn't pass validation - unless it's optional, in which case it's fair to
  // argue that 'foo' should be selected?
  it('does not select parent when only nested field is known and not an object', () => {
    const req = { body: { foo: 'bla' } };
    const instances = selectUnknownFields(req, ['foo.bar'], ['body']);
    expect(instances).toHaveLength(0);
  });

  it('does not select any fields at a wildcard level', () => {
    const req = { body: { foo: 1, bar: 2 } };
    const instances = selectUnknownFields(req, ['*'], ['body']);
    expect(instances).toHaveLength(0);
  });

  it('selects unknown fields nested under a wildcard', () => {
    const req = { body: { obj1: { foo: 1, bar: 2 }, obj2: { foo: 3, baz: 4 } } };
    const instances = selectUnknownFields(req, ['*.foo'], ['body']);
    expect(instances).toHaveLength(2);
    expect(instances[0]).toMatchObject({
      path: 'obj1.bar',
      value: 2,
      location: 'body',
    });
    expect(instances[1]).toMatchObject({
      path: 'obj2.baz',
      value: 4,
      location: 'body',
    });
  });

  it('selects unknown fields nested under a checked wildcard', () => {
    const req = {
      body: {
        obj: {
          nestedobj1: { foo: true, bar: 123, boom: { foo: true } },
          nestedobj2: { foo: true, baz: true },
        },
        arr: [{ foo: 'a' }, { foo: 'a', bar: true }],
      },
    };
    // arr and obj are checked
    const instances = selectUnknownFields(req, ['obj', 'obj.*.foo', 'arr', 'arr.*.foo'], ['body']);
    expect(instances).toHaveLength(4);
    expect(instances[0]).toMatchObject({
      path: 'obj.nestedobj1.bar',
      value: 123,
      location: 'body',
    });
    expect(instances[1]).toMatchObject({
      path: 'obj.nestedobj1.boom',
      value: { foo: true },
      location: 'body',
    });
    expect(instances[2]).toMatchObject({
      path: 'obj.nestedobj2.baz',
      value: true,
      location: 'body',
    });
    expect(instances[3]).toMatchObject({
      path: 'arr[1].bar',
      value: true,
      location: 'body',
    });
  });

  it('selects unknown fields when there are muliple wildcards', () => {
    const req = {
      body: {
        obj: {
          nestedobj1: { foo: true, bar: 123, boom: { foo: true } },
          nestedobj2: { foo: true, baz: true },
        },
        arr: [{ foo: 'a' }, { foo: 'a', bar: true }],
      },
    };
    // arr and obj are checked
    const instances = selectUnknownFields(req, ['obj', 'obj.*', 'arr', 'arr.*.*'], ['body']);
    expect(instances).toHaveLength(0);
  });

  it('does not select any fields at a globstar level', () => {
    const req = { body: { foo: 1, bar: { baz: 2 } } };
    const instances = selectUnknownFields(req, ['**'], ['body']);
    expect(instances).toHaveLength(0);
  });

  it('selects unknown fields deeply nested under a globstar', () => {
    const req = { body: { obj1: { foo: 1, bar: 2 }, obj2: { foo: 3, baz: { foo: 4, qux: 5 } } } };
    const instances = selectUnknownFields(req, ['**.foo'], ['body']);
    expect(instances).toHaveLength(2);
    expect(instances[0]).toMatchObject({
      path: 'obj1.bar',
      value: 2,
      location: 'body',
    });
    expect(instances[1]).toMatchObject({
      path: 'obj2.baz.qux',
      value: 5,
      location: 'body',
    });
  });

  it('does not select any fields nested under a known field', () => {
    const req = { body: { obj1: { foo: 1, bar: 2 } } };
    const instances = selectUnknownFields(req, ['obj1'], ['body']);
    expect(instances).toHaveLength(0);
  });

  it('selects nothing if whole location is known', () => {
    const req = { body: 'foobar' };
    const instances = selectUnknownFields(req, [''], ['body']);
    expect(instances).toHaveLength(0);
  });

  it('selects whole location if it is unknown and not an object', () => {
    const req = { body: 'foobar' };
    const instances = selectUnknownFields(req, ['foo'], ['body']);
    expect(instances).toHaveLength(1);
    expect(instances[0]).toMatchObject({
      path: '',
      value: 'foobar',
      location: 'body',
    });
  });

  it('selects only from passed locations', () => {
    const req = { body: { foo: 1, bar: 2, baz: 3 } };
    const instances = selectUnknownFields(req, ['foo', 'baz'], ['query']);
    expect(instances).toHaveLength(0);
  });

  it('selects from multiple locations', () => {
    const req = {
      body: { foo: 1, bar: 2 },
      query: { foo: 3, baz: 4 },
    };
    const instances = selectUnknownFields(req, ['foo'], ['body', 'query']);
    expect(instances).toHaveLength(2);
    expect(instances[0]).toMatchObject({
      path: 'bar',
      value: 2,
      location: 'body',
    });
    expect(instances[1]).toMatchObject({
      path: 'baz',
      value: 4,
      location: 'query',
    });
  });
});

describe('reconstructFieldPath()', () => {
  it.each([
    ['single text segment', ['foo'], 'foo'],
    ['multiple text segments', ['foo', 'bar', 'baz'], 'foo.bar.baz'],
    ['trailing numeric segment', ['foo', '0'], 'foo[0]'],
    ['numeric segment between text segments', ['foo', '0', 'bar'], 'foo[0].bar'],
    ['numeric segment followed by numeric segment', ['foo', '0', '0'], 'foo[0][0]'],
    ['text segment with a dot', ['foo', '.bar'], 'foo[".bar"]'],
  ])('%s', (_name, input, expected) => {
    expect(reconstructFieldPath(input)).toBe(expected);
  });
});
