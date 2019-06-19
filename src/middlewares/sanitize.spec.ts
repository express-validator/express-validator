import { ContextRunnerImpl, SanitizersImpl } from '../chain';
import { InternalRequest, contextsSymbol } from '../base';
import { sanitize } from './sanitize';

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

  sanitize('foo')(req, {}, () => {
    expect(req[contextsSymbol]).toHaveLength(1);

    sanitize('bar')(req, {}, () => {
      expect(req[contextsSymbol]).toHaveLength(2);
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
