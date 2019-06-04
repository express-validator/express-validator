import { createMockInstance } from 'jest-create-mock-instance';
import * as validator from 'validator';
import { ValidatorsImpl } from './validators-impl';
import { Context } from '../context';
import { Validators } from './validators';
import { Meta } from '../base';
import { CustomValidation, StandardValidation } from '../context-items';

let chain: any;
let context: jest.Mocked<Context>;
let validators: Validators<any>;

beforeEach(() => {
  chain = {};
  context = createMockInstance(Context);
  validators = new ValidatorsImpl(context, chain);
});

it('has methods for all standard validators', () => {
  // Cast is here to workaround the lack of index signature
  const validatorModule = validator as any;

  Object.keys(validator)
    .filter(
      (key): key is keyof Validators<any> => {
        return key.startsWith('is') && typeof validatorModule[key] === 'function';
      },
    )
    .forEach(key => {
      expect(validators).toHaveProperty(key);

      const ret = validators[key].call(validators);
      expect(ret).toBe(chain);
      expect(context.addItem).toHaveBeenCalledWith(
        new StandardValidation(context, validatorModule[key], expect.any(Array)),
      );
    });

  validators.contains('foo');
  expect(context.addItem).toHaveBeenCalledWith(
    new StandardValidation(context, validator.contains, ['foo']),
  );

  validators.equals('bar');
  expect(context.addItem).toHaveBeenCalledWith(
    new StandardValidation(context, validator.equals, ['bar']),
  );

  validators.matches('baz');
  expect(context.addItem).toHaveBeenCalledWith(
    new StandardValidation(context, validator.matches, ['baz', undefined]),
  );
});

describe('#custom()', () => {
  it('adds custom validator to the context', () => {
    const validator = jest.fn();
    const ret = validators.custom(validator);

    expect(ret).toBe(chain);
    expect(context.addItem).toHaveBeenCalledWith(new CustomValidation(context, validator));
  });
});

describe('#exists()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.exists();

    expect(ret).toBe(chain);
    expect(context.addItem).toHaveBeenCalledWith(
      new CustomValidation(context, expect.any(Function)),
    );
  });

  it('checks if context is not undefined by default', async () => {
    validators.exists();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.addItem.mock.calls[0][0];

    await exists.run(undefined, meta);
    await exists.run(null, meta);
    await exists.run(0, meta);
    await exists.run('', meta);
    await exists.run(false, meta);

    expect(context.addError).toHaveBeenCalledTimes(1);
  });

  it('checks if context is not falsy when checkFalsy is true', async () => {
    validators.exists({ checkFalsy: true });

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.addItem.mock.calls[0][0];

    await exists.run(undefined, meta);
    await exists.run(null, meta);
    await exists.run(0, meta);
    await exists.run('', meta);
    await exists.run(false, meta);
    await exists.run(true, meta);

    expect(context.addError).toHaveBeenCalledTimes(5);
  });

  it('checks if context is not null when checkNull is true', async () => {
    validators.exists({ checkNull: true });

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.addItem.mock.calls[0][0];

    await exists.run(undefined, meta);
    await exists.run(null, meta);
    expect(context.addError).toHaveBeenCalledTimes(2);

    await exists.run(0, meta);
    await exists.run('', meta);
    await exists.run(false, meta);
    await exists.run(true, meta);
    expect(context.addError).toHaveBeenCalledTimes(2);
  });
});

describe('#isString()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.isString();

    expect(ret).toBe(chain);
    expect(context.addItem).toHaveBeenCalledWith(
      new CustomValidation(context, expect.any(Function)),
    );
  });

  it('checks if context is string', async () => {
    validators.isString();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const isString = context.addItem.mock.calls[0][0];

    await isString.run('foo', meta);
    expect(context.addError).not.toHaveBeenCalled();

    await isString.run(1, meta);
    await isString.run(true, meta);
    await isString.run(null, meta);
    await isString.run(undefined, meta);
    await isString.run([], meta);
    expect(context.addError).toHaveBeenCalledTimes(5);
  });
});

describe('#isArray()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.isArray();

    expect(ret).toBe(chain);
    expect(context.addItem).toHaveBeenCalledWith(
      new CustomValidation(context, expect.any(Function)),
    );
  });

  it('checks if context is array', async () => {
    validators.isArray();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const isArray = context.addItem.mock.calls[0][0];

    await isArray.run([], meta);
    expect(context.addError).not.toHaveBeenCalled();

    await isArray.run(1, meta);
    await isArray.run(true, meta);
    await isArray.run(null, meta);
    await isArray.run(undefined, meta);
    await isArray.run('foo', meta);
    expect(context.addError).toHaveBeenCalledTimes(5);
  });
});
