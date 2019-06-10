import { ContextHandlerImpl, ContextRunnerImpl, SanitizersImpl, ValidatorsImpl } from '../chain';
import { InternalRequest, contextsSymbol, errorsSymbol } from '../base';
import { check } from './check';

// Some tests might change the list of runners, so we keep the original list and reset it afterwards
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

it('concats to contexts created by previous chains', done => {
  const req: InternalRequest = {};

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
  const proto = ContextRunnerImpl.prototype;

  const { run } = proto;
  proto.run = jest.fn().mockRejectedValue(error);

  check('foo')({}, {}, (err?: Error) => {
    expect(err).toBe(error);

    proto.run = run;
    done();
  });
});
