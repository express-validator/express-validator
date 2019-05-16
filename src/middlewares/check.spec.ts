import { ContextHandlerImpl, SanitizersImpl, ValidatorsImpl } from '../chain';
import { InternalRequest, contextsSymbol, errorsSymbol } from '../base';
import { ContextRunner, EnsureInstance, FieldInstance, PersistBack, RemoveOptionals, Sanitize, SelectFields, Validate } from '../context-runners';
import { check, defaultRunners } from './check';

// Some tests might change the list of runners, so we keep the original list and reset it afterwards
const originalRunners = defaultRunners.slice();
const overrideRunners = (newRunners: ({ new(): ContextRunner })[]) => {
  defaultRunners.splice(0, defaultRunners.length, ...newRunners);
};
afterEach(() => {
  overrideRunners(originalRunners);
});

it('has a default list of runners', () => {
  expect(defaultRunners).toEqual([
    SelectFields,
    Sanitize,
    RemoveOptionals,
    EnsureInstance,
    PersistBack,
    Validate,
  ]);
});

it('has context handler methods', () => {
  const chain = check('foo');
  Object.keys(ContextHandlerImpl.prototype).forEach(method => {
    const fn = (chain as any)[method];
    expect(typeof fn).toBe('function');
  });
});

it('has sanitizer methods', () => {
  const chain = check('foo');
  Object.keys(SanitizersImpl.prototype).forEach(method => {
    const fn = (chain as any)[method];
    expect(typeof fn).toBe('function');
  });
});

it('has validator methods', () => {
  const chain = check('foo');
  Object.keys(ValidatorsImpl.prototype).forEach(method => {
    const fn = (chain as any)[method];
    expect(typeof fn).toBe('function');
  });
});

it('runs the default runners', done => {
  const selectedFields: FieldInstance[] = [{
    path: 'foo',
    originalPath: 'foo',
    location: 'body',
    value: 123,
    originalValue: 123,
  }];

  const runA = jest.fn().mockResolvedValue(selectedFields);
  const runB = jest.fn().mockResolvedValue([]);
  overrideRunners([class { run = runA; }, class { run = runB; }]);

  const req = {
    body: { foo: 123 },
  };
  const middleware = check(['foo', 'bar'], ['body'], 'message');
  expect(middleware.context.fields).toEqual(['foo', 'bar']);
  expect(middleware.context.locations).toEqual(['body']);
  expect(middleware.context.message).toEqual('message');

  middleware(req, {}, () => {
    expect(runA).toHaveBeenCalledWith(req, middleware.context, []);
    expect(runB).toHaveBeenCalledWith(req, middleware.context, selectedFields);

    done();
  });
});

it('sets validation errors thrown by a runner and stops', done => {
  const errorsA = [{
    location: 'body',
    param: 'foo',
    value: 123,
    msg: 'failed',
  }];
  const runA = jest.fn().mockRejectedValue(errorsA);
  const runB = jest.fn();
  overrideRunners([class { run = runA; }, class { run = runB; }]);

  const req: InternalRequest = {};
  check('foo')(req, {}, () => {
    expect(req[errorsSymbol]).toEqual(errorsA);
    expect(runB).not.toHaveBeenCalled();

    done();
  });
});

it('concats to validation errors thrown by previous chains', done => {
  const errorsA = [{
    location: 'body',
    param: 'foo',
    value: 123,
    msg: 'failed',
  }];
  const errorsB = [{
    location: 'body',
    param: 'bar',
    value: 456,
    msg: 'failed',
  }];

  // First chain: it throws. Second chain: it succeeds
  const runA = jest.fn()
    .mockRejectedValueOnce(errorsA)
    .mockResolvedValueOnce([]);

  // First chain will not run this. Only the second one, because runA will succeed.
  const runB = jest.fn().mockRejectedValue(errorsB);

  overrideRunners([class { run = runA; }, class { run = runB; }]);

  const req: InternalRequest = {};
  check('foo')(req, {}, () => {
    check('bar')(req, {}, () => {
      expect(req[errorsSymbol]).toEqual(errorsA.concat(errorsB));

      done();
    });
  });
});

it('concats to contexts created by previous chains', done => {
  const req: InternalRequest = {};

  overrideRunners([]);

  const chainA = check('foo');
  chainA(req, {}, () => {
    const chainB = check('bar');
    chainB(req, {}, () => {
      expect(req[contextsSymbol]).toEqual([chainA.context, chainB.context]);
      done();
    });
  });
});

it('passes unexpected errors down to other middlewares', done => {
  const error = new Error();
  overrideRunners([class { run = jest.fn().mockRejectedValue(error); }]);

  check('foo')({}, {}, (err?: Error) => {
    expect(err).toBe(error);
    done();
  });
});