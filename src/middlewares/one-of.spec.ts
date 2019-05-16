import { InternalRequest, errorsSymbol, failedOneOfContextsSymbol } from '../base';
import { check } from './validation-chain-builders';
import { oneOf } from './one-of';

describe('with a list of chains', () => {
  it('sets a single error for the _error key', done => {
    const req: InternalRequest = {
      cookies: { foo: true, bar: 'def' },
    };

    oneOf([
      check('foo').isInt(),
      check('bar').isInt(),
    ])(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(1);
      expect(req[errorsSymbol]).toContainEqual(expect.objectContaining({
        param: '_error',
        nestedErrors: expect.arrayContaining([
          expect.objectContaining({ param: 'foo' }),
          expect.objectContaining({ param: 'bar' }),
        ]),
      }));

      done();
    });
  });

  it('does not set an error if any chain succeeded', done => {
    const req: InternalRequest = {
      cookies: { foo: true, bar: 123 },
    };

    oneOf([
      check('foo').isInt(),
      check('bar').isInt(),
    ])(req, {}, () => {
      expect(req[errorsSymbol]).toBeUndefined();
      done();
    });
  });
});

describe('with a list of chain groups', () => {
  it('sets a single error for the _error key', done => {
    const req: InternalRequest = {
      cookies: { foo: true, bar: 'def', baz: 123 },
    };

    oneOf([
      [check('foo').isInt(), check('bar').isInt()],
      check('baz').isAlpha(),
    ])(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(1);
      expect(req[errorsSymbol]).toContainEqual(expect.objectContaining({
        param: '_error',
        nestedErrors: expect.arrayContaining([
          expect.objectContaining({ param: 'foo' }),
          expect.objectContaining({ param: 'bar' }),
          expect.objectContaining({ param: 'baz' }),
        ]),
      }));

      done();
    });
  });

  it('does not set an error if any chain group succeeded', done => {
    const req: InternalRequest = {
      cookies: { foo: true, bar: 'def', baz: 'qux' },
    };

    oneOf([
      [check('foo').isInt(), check('bar').isInt()],
      check('baz').isAlpha(),
    ])(req, {}, () => {
      expect(req[errorsSymbol]).toBeUndefined();
      done();
    });
  });
});

it('concats to validation errors thrown by previous middlewares', done => {
  const req: InternalRequest = {
    params: { foo: 'bla' },
  };
  check('foo').isInt()(req, {}, () => {
    oneOf([ check('bar').exists() ])(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(2);
      done();
    });
  });
});

it('concats to failed validation contexts from previous oneOf()s', done => {
  const req: InternalRequest = {
    params: { foo: 'bla' },
  };

  const chain1 = check('foo').isInt();
  const chain2 = check('foo').equals('bar');

  oneOf([chain1, chain2])(req, {}, () => {
    oneOf([chain2])(req, {}, () => {
      expect(req[failedOneOfContextsSymbol]).toEqual([
        chain1.context,
        chain2.context,
        chain2.context,
      ]);

      done();
    });
  });
});

describe('error message', () => {
  it('is "Invalid value(s)" by default', done => {
    const req: InternalRequest = {
      body: { foo: true },
    };

    oneOf([check('foo').isInt()])(req, {}, () => {
      expect(req[errorsSymbol]![0]).toHaveProperty('msg', 'Invalid value(s)');
      done();
    });
  });

  it('can be a custom one', done => {
    const req: InternalRequest = {
      body: { foo: true },
    };

    oneOf([check('foo').isInt()], 'not today')(req, {}, () => {
      expect(req[errorsSymbol]![0]).toHaveProperty('msg', 'not today');
      done();
    });
  });

  it('can be the return of a function', done => {
    const req: InternalRequest = {
      body: { foo: true },
    };

    const message = jest.fn(() => 'keep trying');
    oneOf([check('foo').isInt()], message)(req, {}, () => {
      expect(req[errorsSymbol]![0]).toHaveProperty('msg', 'keep trying');
      expect(message).toHaveBeenCalledWith({ req });
      done();
    });
  });
});