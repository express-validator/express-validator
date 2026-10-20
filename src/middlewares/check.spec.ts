import { ContextHandlerImpl, ContextRunnerImpl, SanitizersImpl, ValidatorsImpl } from '../chain';
import { InternalRequest, contextsKey } from '../base';
import { check } from './check';

describe.each(['', 0, false])('with falsy error message %p', message => {
  it('preserves a validator-level message when the validator returns false', async () => {
    const result = await check('foo', ['body'], 'field fallback')
      .custom(() => false)
      .withMessage(message)
      .run({ body: { foo: 'value' } });
    expect(result.array()[0].msg).toBe(message);
  });

  it('gives the validator-level message precedence over a thrown error', async () => {
    const result = await check('foo', ['body'], 'field fallback')
      .custom(() => {
        throw new Error('thrown message');
      })
      .withMessage(message)
      .run({ body: { foo: 'value' } });
    expect(result.array()[0].msg).toBe(message);
  });

  it('gives the validator-level message precedence over a rejected promise', async () => {
    const result = await check('foo', ['body'], 'field fallback')
      .custom(() => Promise.reject(new Error('rejected message')))
      .withMessage(message)
      .run({ body: { foo: 'value' } });
    expect(result.array()[0].msg).toBe(message);
  });

  it('preserves a field-level fallback when no validator-level message is set', async () => {
    const result = await check('foo', ['body'], message)
      .isEmail()
      .run({ body: { foo: 'invalid' } });
    expect(result.array()[0].msg).toBe(message);
  });
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
    const context1 = req1[contextsKey]![0];

    const req2: InternalRequest = {};
    chain(req2, {}, () => {
      expect(req2[contextsKey]).toHaveLength(1);
      expect(req2[contextsKey]![0]).not.toBe(context1);
      expect(req2[contextsKey]![0].errors).toHaveLength(1);
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
