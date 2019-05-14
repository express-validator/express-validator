import { defaultRunners, sanitize } from './sanitize';
import { PersistBack, Sanitize, EnsureInstance, RemoveOptionals, SelectFields, ContextRunner, FieldInstance } from '../context-runners';
import { SanitizersImpl } from '../chain';
import { InternalRequest, contextsSymbol } from '../base';

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
  ]);
});

it('has sanitizer methods', () => {
  const chain = sanitize('foo');
  Object.keys(SanitizersImpl.prototype).forEach(method => {
    expect(chain).toHaveProperty(method);
    expect(typeof (chain as any)[method]).toBe('function');
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
  const middleware = sanitize(['foo', 'bar'], ['body']);
  expect(middleware.context.fields).toEqual(['foo', 'bar']);
  expect(middleware.context.locations).toEqual(['body']);

  middleware(req, {}, () => {
    expect(runA).toHaveBeenCalledWith(req, middleware.context, []);
    expect(runB).toHaveBeenCalledWith(req, middleware.context, selectedFields);

    done();
  });
});

it('concats to contexts created by previous chains', done => {
  const req: InternalRequest = {};

  overrideRunners([]);

  const chainA = sanitize('foo');
  chainA(req, {}, () => {
    const chainB = sanitize('bar');
    chainB(req, {}, () => {
      expect(req[contextsSymbol]).toEqual([chainA.context, chainB.context]);
      done();
    });
  });
});

it('passes unexpected errors down to other middlewares', done => {
  const error = new Error();
  overrideRunners([class { run = jest.fn().mockRejectedValue(error); }]);

  sanitize('foo')({}, {}, (err?: Error) => {
    expect(err).toBe(error);
    done();
  });
});