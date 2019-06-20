import * as validator from 'validator';
import { Sanitization } from '../context-items/sanitization';
import { Meta } from '../base';
import { ContextBuilder } from '../context-builder';
import { Sanitizers } from './sanitizers';
import { SanitizersImpl } from './sanitizers-impl';

let chain: any;
let builder: ContextBuilder;
let sanitizers: Sanitizers<any>;

beforeEach(() => {
  chain = {};
  builder = new ContextBuilder();
  jest.spyOn(builder, 'addItem');

  sanitizers = new SanitizersImpl(builder, chain);
});

it('has methods for all standard validators', () => {
  // Cast is here to workaround the lack of index signature
  const validatorModule = validator as any;

  Object.keys(validator)
    .filter((key): key is keyof Sanitizers<any> => {
      return (
        key.startsWith('to') && typeof validatorModule[key] === 'function' && key !== 'toString'
      );
    })
    .forEach(key => {
      expect(sanitizers).toHaveProperty(key);

      const ret = sanitizers[key].call(sanitizers);
      expect(ret).toBe(chain);
      expect(builder.addItem).toHaveBeenLastCalledWith(
        new Sanitization(validatorModule[key], false, expect.any(Array)),
      );
    });

  sanitizers.blacklist('foo');
  expect(builder.addItem).toHaveBeenLastCalledWith(
    new Sanitization(validator.blacklist, false, ['foo']),
  );

  sanitizers.whitelist('bar');
  expect(builder.addItem).toHaveBeenLastCalledWith(
    new Sanitization(validator.whitelist, false, ['bar']),
  );

  sanitizers.stripLow(true);
  expect(builder.addItem).toHaveBeenLastCalledWith(
    new Sanitization(validator.stripLow, false, [true]),
  );

  sanitizers.ltrim('a');
  expect(builder.addItem).toHaveBeenLastCalledWith(new Sanitization(validator.ltrim, false, ['a']));

  sanitizers.rtrim('z');
  expect(builder.addItem).toHaveBeenLastCalledWith(new Sanitization(validator.rtrim, false, ['z']));

  sanitizers.trim('az');
  expect(builder.addItem).toHaveBeenLastCalledWith(new Sanitization(validator.trim, false, ['az']));

  sanitizers.escape();
  expect(builder.addItem).toHaveBeenLastCalledWith(new Sanitization(validator.escape, false, []));

  sanitizers.unescape();
  expect(builder.addItem).toHaveBeenLastCalledWith(new Sanitization(validator.unescape, false, []));

  sanitizers.normalizeEmail();
  expect(builder.addItem).toHaveBeenLastCalledWith(
    new Sanitization(validator.normalizeEmail, false, [undefined]),
  );
});

describe('#customSanitizer()', () => {
  it('adds custom sanitizer to the context', () => {
    const sanitizer = jest.fn();
    const ret = sanitizers.customSanitizer(sanitizer);

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new Sanitization(sanitizer, true));
  });
});

describe('#toArray()', () => {
  it('adds toArray() sanitizer to the context', () => {
    const ret = sanitizers.toArray();

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new Sanitization(expect.any(Function), true));
  });

  it('sanitizes to array', async () => {
    sanitizers.toArray();
    const context = builder.build();
    context.addFieldInstances([
      {
        location: 'body',
        path: 'foo',
        originalPath: 'foo',
        value: '',
        originalValue: '',
      },
    ]);

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const toArray = context.stack[0];

    await toArray.run(context, [], meta);
    expect(context.getData()[0].value).toEqual([]);

    await toArray.run(context, 'foo', meta);
    expect(context.getData()[0].value).toEqual(['foo']);

    await toArray.run(context, ['foo'], meta);
    expect(context.getData()[0].value).toEqual(['foo']);

    await toArray.run(context, '', meta);
    expect(context.getData()[0].value).toEqual(['']);

    await toArray.run(context, null, meta);
    expect(context.getData()[0].value).toEqual([null]);

    await toArray.run(context, undefined, meta);
    expect(context.getData()[0].value).toEqual([]);
  });
});
