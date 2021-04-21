import { InternalRequest, contextsKey } from '../base';
import { ContextRunnerImpl } from '../chain/context-runner-impl';
import { Result } from '../validation-result';
import { check } from './validation-chain-builders';
import { oneOf } from './one-of';

const getOneOfContext = (req: InternalRequest) => {
  const contexts = req[contextsKey] || [];
  return contexts[contexts.length - 1];
};

it('runs chains passed to it as a dry-run', done => {
  const req = {};
  const spy = jest.spyOn(ContextRunnerImpl.prototype, 'run');
  oneOf([check('bar'), check('baz')])(req, {}, () => {
    expect(spy).toHaveBeenCalledTimes(3);
    // Call 3 asserted by next test
    expect(spy).toHaveBeenNthCalledWith(1, req, { dryRun: true });
    expect(spy).toHaveBeenNthCalledWith(2, req, { dryRun: true });

    spy.mockRestore();
    done();
  });
});

it('runs surrogate context created internally', done => {
  const req = {};
  const spy = jest.spyOn(ContextRunnerImpl.prototype, 'run');
  oneOf([check('bar'), check('baz')])(req, {}, () => {
    expect(spy).toHaveBeenCalledTimes(3);
    // Calls 1 and 2 asserted by previous test
    expect(spy).toHaveBeenNthCalledWith(3, req);

    spy.mockRestore();
    done();
  });
});

it('passes unexpected errors down to other middlewares', done => {
  const error = new Error();
  const spy = jest.spyOn(ContextRunnerImpl.prototype, 'run').mockRejectedValue(error);

  oneOf([check('bar'), check('baz')])({}, {}, (err?: any) => {
    expect(err).toBe(error);

    spy.mockRestore();
    done();
  });
});

describe('with a list of chains', () => {
  it('sets a single error for the _error key', done => {
    const req: InternalRequest = {
      cookies: { foo: true, bar: 'def' },
    };

    oneOf([check('foo').isInt(), check('bar').isInt()])(req, {}, () => {
      const context = getOneOfContext(req);
      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual(
        expect.objectContaining({
          param: '_error',
          nestedErrors: expect.arrayContaining([
            expect.objectContaining({ param: 'foo' }),
            expect.objectContaining({ param: 'bar' }),
          ]),
        }),
      );

      done();
    });
  });

  it('does not set an error if any chain succeeded', done => {
    const req: InternalRequest = {
      cookies: { foo: true, bar: 123 },
    };

    oneOf([check('foo').isInt(), check('bar').isInt()])(req, {}, () => {
      const context = getOneOfContext(req);
      expect(context.errors).toHaveLength(0);
      done();
    });
  });
});

describe('with a list of chain groups', () => {
  it('sets a single error for the _error key', done => {
    const req: InternalRequest = {
      cookies: { foo: true, bar: 'def', baz: 123 },
    };

    oneOf([[check('foo').isInt(), check('bar').isInt()], check('baz').isAlpha()])(req, {}, () => {
      const context = getOneOfContext(req);
      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual(
        expect.objectContaining({
          param: '_error',
          nestedErrors: expect.arrayContaining([
            expect.objectContaining({ param: 'foo' }),
            expect.objectContaining({ param: 'bar' }),
            expect.objectContaining({ param: 'baz' }),
          ]),
        }),
      );

      done();
    });
  });

  it('does not set an error if any chain group succeeded', done => {
    const req: InternalRequest = {
      cookies: { foo: true, bar: 'def', baz: 'qux' },
    };

    oneOf([[check('foo').isInt(), check('bar').isInt()], check('baz').isAlpha()])(req, {}, () => {
      const context = getOneOfContext(req);
      expect(context.errors).toHaveLength(0);
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
      const context = getOneOfContext(req);
      expect(context.errors[0]).toHaveProperty('msg', 'Invalid value(s)');
      done();
    });
  });

  it('can be a custom one', done => {
    const req: InternalRequest = {
      body: { foo: true },
    };

    oneOf([check('foo').isInt()], 'not today')(req, {}, () => {
      const context = getOneOfContext(req);
      expect(context.errors[0]).toHaveProperty('msg', 'not today');
      done();
    });
  });

  it('can be the return of a function', done => {
    const req: InternalRequest = {
      body: { foo: true },
    };

    const message = jest.fn(() => 'keep trying');
    oneOf([check('foo').isInt()], message)(req, {}, () => {
      const context = getOneOfContext(req);
      expect(context.errors[0]).toHaveProperty('msg', 'keep trying');
      expect(message).toHaveBeenCalledWith({ req });
      done();
    });
  });
});

describe('imperatively run oneOf', () => {
  it('sets errors in context when validation fails', async () => {
    const req: InternalRequest = {
      body: { foo: true },
    };

    const middleware = oneOf([check('foo').isInt()]);
    await middleware.run(req);

    const context = getOneOfContext(req);
    expect(context.errors.length).toEqual(1);
  });

  it('should throw an error if ContextRunner throws', async () => {
    const req: InternalRequest = {
      body: { foo: true },
    };
    const error = new Error();
    const spy = jest.spyOn(ContextRunnerImpl.prototype, 'run').mockRejectedValue(error);

    const middleware = oneOf([check('foo').isBoolean()]);
    await expect(middleware.run(req)).rejects.toThrow(error);
    spy.mockRestore();
  });

  it('sets no error in context when successful', async () => {
    const req: InternalRequest = {
      body: { foo: true },
    };

    const middleware = oneOf([check('foo').isBoolean()]);
    const result = await middleware.run(req);

    const context = getOneOfContext(req);
    expect(result).toBeInstanceOf(Result);
    expect(context.errors.length).toEqual(0);
  });
});
