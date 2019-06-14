import * as validator from 'validator';
import { ValidatorsImpl } from './validators-impl';
import { Context } from '../context';
import { Validators } from './validators';
import { Meta } from '../base';
import { CustomValidation, StandardValidation } from '../context-items';

let chain: any;
let context: Context;
let validators: Validators<any>;

beforeEach(() => {
  chain = {};
  context = new Context(['foo'], ['params']);
  jest.spyOn(context, 'addItem');
  jest.spyOn(context, 'addError');

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
        new StandardValidation(validatorModule[key], false, expect.any(Array)),
      );
    });

  validators.contains('foo');
  expect(context.addItem).toHaveBeenCalledWith(
    new StandardValidation(validator.contains, false, ['foo']),
  );

  validators.equals('bar');
  expect(context.addItem).toHaveBeenCalledWith(
    new StandardValidation(validator.equals, false, ['bar']),
  );

  validators.matches('baz');
  expect(context.addItem).toHaveBeenCalledWith(
    new StandardValidation(validator.matches, false, ['baz', undefined]),
  );
});

describe('#custom()', () => {
  it('adds custom validator to the context', () => {
    const validator = jest.fn();
    const ret = validators.custom(validator);

    expect(ret).toBe(chain);
    expect(context.addItem).toHaveBeenCalledWith(new CustomValidation(validator, false));
  });
});

describe('#exists()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.exists();

    expect(ret).toBe(chain);
    expect(context.addItem).toHaveBeenCalledWith(new CustomValidation(expect.any(Function), false));
  });

  it('checks if context is not undefined by default', async () => {
    validators.exists();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.stack[0];

    await exists.run(context, undefined, meta);
    await exists.run(context, null, meta);
    await exists.run(context, 0, meta);
    await exists.run(context, '', meta);
    await exists.run(context, false, meta);

    expect(context.addError).toHaveBeenCalledTimes(1);
  });

  it('checks if context is not falsy when checkFalsy is true', async () => {
    validators.exists({ checkFalsy: true });

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.stack[0];

    await exists.run(context, undefined, meta);
    await exists.run(context, null, meta);
    await exists.run(context, 0, meta);
    await exists.run(context, '', meta);
    await exists.run(context, false, meta);
    await exists.run(context, true, meta);

    expect(context.addError).toHaveBeenCalledTimes(5);
  });

  it('checks if context is not null when checkNull is true', async () => {
    validators.exists({ checkNull: true });

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.stack[0];

    await exists.run(context, undefined, meta);
    await exists.run(context, null, meta);
    expect(context.addError).toHaveBeenCalledTimes(2);

    await exists.run(context, 0, meta);
    await exists.run(context, '', meta);
    await exists.run(context, false, meta);
    await exists.run(context, true, meta);
    expect(context.addError).toHaveBeenCalledTimes(2);
  });
});

describe('#isString()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.isString();

    expect(ret).toBe(chain);
    expect(context.addItem).toHaveBeenCalledWith(new CustomValidation(expect.any(Function), false));
  });

  it('checks if context is string', async () => {
    validators.isString();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const isString = context.stack[0];

    await isString.run(context, 'foo', meta);
    expect(context.addError).not.toHaveBeenCalled();

    await isString.run(context, 1, meta);
    await isString.run(context, true, meta);
    await isString.run(context, null, meta);
    await isString.run(context, undefined, meta);
    await isString.run(context, [], meta);
    expect(context.addError).toHaveBeenCalledTimes(5);
  });
});

describe('#isArray()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.isArray();

    expect(ret).toBe(chain);
    expect(context.addItem).toHaveBeenCalledWith(new CustomValidation(expect.any(Function), false));
  });

  it('checks if context is array', async () => {
    validators.isArray();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const isArray = context.stack[0];

    await isArray.run(context, [], meta);
    expect(context.addError).not.toHaveBeenCalled();

    await isArray.run(context, 1, meta);
    await isArray.run(context, true, meta);
    await isArray.run(context, null, meta);
    await isArray.run(context, undefined, meta);
    await isArray.run(context, 'foo', meta);
    expect(context.addError).toHaveBeenCalledTimes(5);
  });
});
