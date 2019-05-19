import { createMockInstance } from 'jest-create-mock-instance';
import * as validator from 'validator';
import { ValidatorsImpl } from './validators-impl';
import { Context } from '../context';
import { Validators } from './validators';
import { CustomValidator, Meta } from '../base';

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
      expect(context.addValidation).toHaveBeenCalledWith(validatorModule[key], {
        custom: false,
        options: expect.any(Array),
      });
    });

  validators.contains('foo');
  expect(context.addValidation).toHaveBeenCalledWith(validator.contains, {
    custom: false,
    options: ['foo'],
  });

  validators.equals('bar');
  expect(context.addValidation).toHaveBeenCalledWith(validator.equals, {
    custom: false,
    options: ['bar'],
  });

  validators.matches('baz');
  expect(context.addValidation).toHaveBeenCalledWith(validator.matches, {
    custom: false,
    options: ['baz', undefined],
  });
});

describe('#custom()', () => {
  it('adds custom validator to the context', () => {
    const validator = jest.fn();
    const ret = validators.custom(validator);

    expect(ret).toBe(chain);
    expect(context.addValidation).toHaveBeenCalledWith(validator, {
      custom: true,
    });
  });
});

describe('#exists()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.exists();

    expect(ret).toBe(chain);
    expect(context.addValidation).toHaveBeenCalledWith(expect.any(Function), {
      custom: true,
    });
  });

  it('checks if context is not undefined by default', () => {
    validators.exists();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.addValidation.mock.calls[0][0] as CustomValidator;

    expect(exists(undefined, meta)).toBe(false);
    expect(exists(null, meta)).toBe(true);
    expect(exists(0, meta)).toBe(true);
    expect(exists('', meta)).toBe(true);
    expect(exists(false, meta)).toBe(true);
  });

  it('checks if context is not falsy when checkFalsy is true', () => {
    validators.exists({ checkFalsy: true });

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.addValidation.mock.calls[0][0] as CustomValidator;

    expect(exists(undefined, meta)).toBe(false);
    expect(exists(null, meta)).toBe(false);
    expect(exists(0, meta)).toBe(false);
    expect(exists('', meta)).toBe(false);
    expect(exists(false, meta)).toBe(false);
    expect(exists(true, meta)).toBe(true);
  });

  it('checks if context is not null when checkNull is true', () => {
    validators.exists({ checkNull: true });

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.addValidation.mock.calls[0][0] as CustomValidator;

    expect(exists(undefined, meta)).toBe(false);
    expect(exists(null, meta)).toBe(false);
    expect(exists(0, meta)).toBe(true);
    expect(exists('', meta)).toBe(true);
    expect(exists(false, meta)).toBe(true);
    expect(exists(true, meta)).toBe(true);
  });
});

describe('#isString()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.isString();

    expect(ret).toBe(chain);
    expect(context.addValidation).toHaveBeenCalledWith(expect.any(Function), {
      custom: true,
    });
  });

  it('checks if context is string', () => {
    validators.isString();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const isString = context.addValidation.mock.calls[0][0] as CustomValidator;

    expect(isString('foo', meta)).toBe(true);
    expect(isString(1, meta)).toBe(false);
    expect(isString(true, meta)).toBe(false);
    expect(isString(null, meta)).toBe(false);
    expect(isString(undefined, meta)).toBe(false);
    expect(isString([], meta)).toBe(false);
  });
});

describe('#isArray()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.isArray();

    expect(ret).toBe(chain);
    expect(context.addValidation).toHaveBeenCalledWith(expect.any(Function), {
      custom: true,
    });
  });

  it('checks if context is array', () => {
    validators.isArray();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const isArray = context.addValidation.mock.calls[0][0] as CustomValidator;

    expect(isArray([], meta)).toBe(true);
    expect(isArray('foo', meta)).toBe(false);
    expect(isArray(1, meta)).toBe(false);
    expect(isArray(true, meta)).toBe(false);
    expect(isArray(null, meta)).toBe(false);
    expect(isArray(undefined, meta)).toBe(false);
  });
});
