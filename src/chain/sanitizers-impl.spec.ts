import { createMockInstance } from 'jest-create-mock-instance';
import * as validator from 'validator';
import { SanitizersImpl } from './sanitizers-impl';
import { Context } from '../context';
import { Sanitizers } from './sanitizers';
import { CustomSanitizer, Meta } from '../base';

let chain: any;
let context: jest.Mocked<Context>;
let sanitizers: Sanitizers<any>;

beforeEach(() => {
  chain = {};
  context = createMockInstance(Context);
  sanitizers = new SanitizersImpl(context, chain);
});

it('has methods for all standard validators', () => {
  // Cast is here to workaround the lack of index signature
  const validatorModule = validator as any;

  Object.keys(validator)
    .filter(
      (key): key is keyof Sanitizers<any> => {
        return (
          key.startsWith('to') && typeof validatorModule[key] === 'function' && key !== 'toString'
        );
      },
    )
    .forEach(key => {
      expect(sanitizers).toHaveProperty(key);

      const ret = sanitizers[key].call(sanitizers);
      expect(ret).toBe(chain);
      expect(context.addSanitization).toHaveBeenLastCalledWith(validatorModule[key], {
        custom: false,
        options: expect.any(Array),
      });
    });

  sanitizers.blacklist('foo');
  expect(context.addSanitization).toHaveBeenLastCalledWith(validator.blacklist, {
    custom: false,
    options: ['foo'],
  });

  sanitizers.whitelist('bar');
  expect(context.addSanitization).toHaveBeenLastCalledWith(validator.whitelist, {
    custom: false,
    options: ['bar'],
  });

  sanitizers.stripLow(true);
  expect(context.addSanitization).toHaveBeenLastCalledWith(validator.stripLow, {
    custom: false,
    options: [true],
  });

  sanitizers.ltrim('a');
  expect(context.addSanitization).toHaveBeenLastCalledWith(validator.ltrim, {
    custom: false,
    options: ['a'],
  });

  sanitizers.rtrim('z');
  expect(context.addSanitization).toHaveBeenLastCalledWith(validator.rtrim, {
    custom: false,
    options: ['z'],
  });

  sanitizers.trim('az');
  expect(context.addSanitization).toHaveBeenLastCalledWith(validator.trim, {
    custom: false,
    options: ['az'],
  });

  sanitizers.escape();
  expect(context.addSanitization).toHaveBeenLastCalledWith(validator.escape, {
    custom: false,
    options: [],
  });

  sanitizers.unescape();
  expect(context.addSanitization).toHaveBeenLastCalledWith(validator.unescape, {
    custom: false,
    options: [],
  });

  sanitizers.normalizeEmail();
  expect(context.addSanitization).toHaveBeenLastCalledWith(validator.normalizeEmail, {
    custom: false,
    options: [undefined],
  });
});

describe('#customSanitizer()', () => {
  it('adds custom sanitizer to the context', () => {
    const sanitizer = jest.fn();
    const ret = sanitizers.customSanitizer(sanitizer);

    expect(ret).toBe(chain);
    expect(context.addSanitization).toHaveBeenCalledWith(sanitizer, {
      custom: true,
    });
  });
});

describe('#toArray()', () => {
  it('adds toArray() sanitizer to the context', () => {
    const ret = sanitizers.toArray();

    expect(ret).toBe(chain);
    expect(context.addSanitization).toHaveBeenCalledWith(expect.any(Function), {
      custom: true,
    });
  });

  it('sanitizes to array', () => {
    sanitizers.toArray();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const toArray = context.addSanitization.mock.calls[0][0] as CustomSanitizer;

    expect(toArray([], meta)).toEqual([]);
    expect(toArray('foo', meta)).toEqual(['foo']);
    expect(toArray(['foo'], meta)).toEqual(['foo']);
    expect(toArray('', meta)).toEqual(['']);
    expect(toArray(null, meta)).toEqual([null]);
    expect(toArray(undefined, meta)).toEqual([]);
  });
});
