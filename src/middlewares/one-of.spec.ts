import { InternalRequest, contextsSymbol } from '../base';
import { ContextRunnerImpl } from '../chain/context-runner-impl';
import { check } from './validation-chain-builders';
import { oneOf } from './one-of';

const getOneOfContext = (req: InternalRequest) => {
  const contexts = req[contextsSymbol] || [];
  return contexts[contexts.length - 1];
};

it('concats to contexts create by previous chains', done => {
  const req: InternalRequest = {};

  const chainA = check('foo');
  chainA(req, {}, () => {
    oneOf([check('bar'), check('baz')])(req, {}, () => {
      expect(req[contextsSymbol]).toHaveLength(2);
      done();
    });
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
