import { sanitize } from './sanitize';
import { ContextRunnerImpl, SanitizersImpl } from '../chain';
import { InternalRequest, contextsSymbol } from '../base';

it('has sanitizer methods', () => {
  const chain = sanitize('foo');
  Object.keys(SanitizersImpl.prototype).forEach(method => {
    const fn = (chain as any)[method];
    expect(typeof fn).toBe('function');
  });
});

it('has context runner methods', () => {
  const chain = sanitize('foo');
  Object.keys(ContextRunnerImpl.prototype).forEach(method => {
    const fn = (chain as any)[method];
    expect(typeof fn).toBe('function');
  });
});

it('concats to contexts created by previous chains', done => {
  const req: InternalRequest = {};

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
  const proto = ContextRunnerImpl.prototype;

  const { run } = proto;
  proto.run = jest.fn().mockRejectedValue(error);

  sanitize('foo')({}, {}, (err?: Error) => {
    expect(err).toBe(error);

    proto.run = run;
    done();
  });
});
