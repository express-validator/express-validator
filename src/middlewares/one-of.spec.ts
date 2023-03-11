import { InternalRequest, contextsKey } from '../base';
import { ContextRunnerImpl } from '../chain/context-runner-impl';
import { Result } from '../validation-result';
import { check } from './validation-chain-builders';
import { OneOfErrorType, OneOfOptions, oneOf } from './one-of';

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
    expect(spy).toHaveBeenNthCalledWith(3, req, undefined);

    spy.mockRestore();
    done();
  });
});

it('runs in dry-run mode', async () => {
  const req = {};
  const spy = jest.spyOn(ContextRunnerImpl.prototype, 'run');
  await oneOf([check('bar'), check('baz')]).run(req, { dryRun: true });
  // Calls 1 and 2 asserted by previous test
  expect(spy).toHaveBeenNthCalledWith(3, req, { dryRun: true });
  spy.mockRestore();
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
      expect(context.errors).toMatchSnapshot();
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
      expect(context.errors).toMatchSnapshot();
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

  it('stops running chains in a group when one of them has errors and request-level bail', done => {
    const req = {
      cookies: { foo: true, bar: 'def', baz: 'qux' },
    };

    const custom = jest.fn();
    oneOf([
      [check('foo').isInt().bail({ level: 'request' }), check('bar').custom(custom)],
      check('baz').isAlpha(),
    ])(req, {}, () => {
      expect(custom).not.toHaveBeenCalled();
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

    oneOf([check('foo').isInt()], { message: 'not today' })(req, {}, () => {
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
    oneOf([check('foo').isInt()], { message })(req, {}, () => {
      const context = getOneOfContext(req);
      expect(context.errors).toMatchSnapshot();
      done();
    });
  });
});

describe('should let the user to choose between multiple error types', () => {
  const errors: OneOfErrorType[] = ['grouped', 'flat'];
  it.each(errors)(`%s error type`, async errorType => {
    const req: InternalRequest = {
      body: { foo: true },
    };
    const options: OneOfOptions = {
      errorType,
    };

    await oneOf([check('foo').isString(), check('bar').isFloat()], options).run(req);
    const context = getOneOfContext(req);
    expect(context.errors).toMatchSnapshot();
  });

  it('leastErroredOnly error type', done => {
    const req: InternalRequest = {
      body: { foo: true, bar: 'bar' },
    };
    const options: OneOfOptions = {
      errorType: 'leastErroredOnly',
    };

    oneOf(
      [
        [check('foo').isFloat(), check('bar').isInt()],
        [check('foo').isString(), check('bar').isString()], // least errored
        [check('foo').isFloat(), check('bar').isBoolean()],
      ],
      options,
    )(req, {}, () => {
      const context = getOneOfContext(req);
      expect(context.errors).toMatchSnapshot();
      done();
    });
  });
});

describe('should default to grouped errorType', () => {
  it('when no options are provided', async () => {
    const req: InternalRequest = {
      body: { foo: true },
    };
    await oneOf([check('foo').isString(), check('bar').isFloat()]).run(req);
    const context = getOneOfContext(req);
    expect(context.errors[0]).toEqual(
      expect.objectContaining({
        type: 'alternative_grouped',
        nestedErrors: [expect.anything(), expect.anything()],
      }),
    );
  });

  it('when invalid error type is provided', async () => {
    const req: InternalRequest = {
      body: { foo: true },
    };
    await oneOf([check('foo').isString(), check('bar').isFloat()], {
      // @ts-ignore
      errorType: 'invalid error type',
    }).run(req);
    const context = getOneOfContext(req);
    expect(context.errors[0]).toEqual(
      expect.objectContaining({
        type: 'alternative_grouped',
        nestedErrors: [expect.anything(), expect.anything()],
      }),
    );
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
