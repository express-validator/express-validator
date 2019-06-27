import { ContextHandlerImpl, ContextRunnerImpl, SanitizersImpl, ValidatorsImpl } from '../chain';
import { InternalRequest, contextsSymbol } from '../base';
import { check } from './check';

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

it('has context runner methods', () => {
  const chain = check('foo');
  Object.keys(ContextRunnerImpl.prototype).forEach(method => {
    const fn = (chain as any)[method];
    expect(typeof fn).toBe('function');
  });
});

it('does not share contexts between chain runs', done => {
  const chain = check('foo', ['body']).isEmail();
  const req1: InternalRequest = { body: { foo: 'bla' } };
  chain(req1, {}, () => {
    const context1 = req1[contextsSymbol]![0];

    const req2: InternalRequest = {};
    chain(req2, {}, () => {
      expect(req2[contextsSymbol]).toHaveLength(1);
      expect(req2[contextsSymbol]![0]).not.toBe(context1);
      expect(req2[contextsSymbol]![0].errors).toHaveLength(1);
      done();
    });
  });
});

it('passes unexpected errors down to other middlewares', done => {
  const error = new Error();
  const proto = ContextRunnerImpl.prototype;

  const { run } = proto;
  proto.run = jest.fn().mockRejectedValue(error);

  check('foo')({}, {}, (err?: Error) => {
    expect(err).toBe(error);

    proto.run = run;
    done();
  });
});
