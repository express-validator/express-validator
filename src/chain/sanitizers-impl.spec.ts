import { createMockInstance } from 'jest-create-mock-instance';
import * as validator from 'validator';
import { SanitizersImpl } from './sanitizers-impl';
import { Context } from '../context';
import { Sanitizers } from './sanitizers';
import { Sanitization } from '../context-items/sanitization';

let chain: any;
let context: Context;
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
      expect(context.addItem).toHaveBeenLastCalledWith(
        new Sanitization(context, validatorModule[key], false, expect.any(Array)),
      );
    });

  sanitizers.blacklist('foo');
  expect(context.addItem).toHaveBeenLastCalledWith(
    new Sanitization(context, validator.blacklist, false, ['foo']),
  );

  sanitizers.whitelist('bar');
  expect(context.addItem).toHaveBeenLastCalledWith(
    new Sanitization(context, validator.whitelist, false, ['bar']),
  );

  sanitizers.stripLow(true);
  expect(context.addItem).toHaveBeenLastCalledWith(
    new Sanitization(context, validator.stripLow, false, [true]),
  );

  sanitizers.ltrim('a');
  expect(context.addItem).toHaveBeenLastCalledWith(
    new Sanitization(context, validator.ltrim, false, ['a']),
  );

  sanitizers.rtrim('z');
  expect(context.addItem).toHaveBeenLastCalledWith(
    new Sanitization(context, validator.rtrim, false, ['z']),
  );

  sanitizers.trim('az');
  expect(context.addItem).toHaveBeenLastCalledWith(
    new Sanitization(context, validator.trim, false, ['az']),
  );

  sanitizers.escape();
  expect(context.addItem).toHaveBeenLastCalledWith(
    new Sanitization(context, validator.escape, false, []),
  );

  sanitizers.unescape();
  expect(context.addItem).toHaveBeenLastCalledWith(
    new Sanitization(context, validator.unescape, false, []),
  );

  sanitizers.normalizeEmail();
  expect(context.addItem).toHaveBeenLastCalledWith(
    new Sanitization(context, validator.normalizeEmail, false, [undefined]),
  );
});

describe('#customSanitizer()', () => {
  it('adds custom sanitizer to the context', () => {
    const sanitizer = jest.fn();
    const ret = sanitizers.customSanitizer(sanitizer);

    expect(ret).toBe(chain);
    expect(context.addItem).toHaveBeenCalledWith(new Sanitization(context, sanitizer, true));
  });
});
