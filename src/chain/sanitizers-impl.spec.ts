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

  it('adds a custom async sanitizer that resolves to the context', () => {
    const sanitizer = jest.fn(async () => 1);
    const ret = sanitizers.customSanitizer(sanitizer);

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new Sanitization(sanitizer, true));
  });

  it('adds a custom async sanitizer that rejects to the context', () => {
    const sanitizer = jest.fn(async () => {
      throw new Error('Dummy Error');
    });
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

describe('#toLowerCase()', () => {
  it('adds toLowerCase() sanitizer to the context', () => {
    const ret = sanitizers.toLowerCase();

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new Sanitization(expect.any(Function), true));
  });
  it('sanitizes to lowerCase', async () => {
    sanitizers.toLowerCase();
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
    const toLowerCase = context.stack[0];

    await toLowerCase.run(context, '', meta);
    expect(context.getData()[0].value).toEqual('');

    await toLowerCase.run(context, 'foo', meta);
    expect(context.getData()[0].value).toEqual('foo');

    await toLowerCase.run(context, 'FOO', meta);
    expect(context.getData()[0].value).toEqual('foo');

    await toLowerCase.run(context, '_FoO123', meta);
    expect(context.getData()[0].value).toEqual('_foo123');

    await toLowerCase.run(context, null, meta);
    expect(context.getData()[0].value).toEqual(null);

    await toLowerCase.run(context, undefined, meta);
    expect(context.getData()[0].value).toEqual(undefined);
  });
});

describe('#toUpperCase()', () => {
  it('adds toUpperCase() sanitizer to the context', () => {
    const ret = sanitizers.toUpperCase();

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new Sanitization(expect.any(Function), true));
  });

  it('sanitizes to UpperCase', async () => {
    sanitizers.toUpperCase();
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
    const toUpperCase = context.stack[0];

    await toUpperCase.run(context, '', meta);
    expect(context.getData()[0].value).toEqual('');

    await toUpperCase.run(context, 'foo', meta);
    expect(context.getData()[0].value).toEqual('FOO');

    await toUpperCase.run(context, 'FOO', meta);
    expect(context.getData()[0].value).toEqual('FOO');

    await toUpperCase.run(context, '_FoO123', meta);
    expect(context.getData()[0].value).toEqual('_FOO123');

    await toUpperCase.run(context, null, meta);
    expect(context.getData()[0].value).toEqual(null);

    await toUpperCase.run(context, undefined, meta);
    expect(context.getData()[0].value).toEqual(undefined);
  });
});

describe('#default()', () => {
  it('adds default() sanitizer to the context', () => {
    const ret = sanitizers.default(5);

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new Sanitization(expect.any(Function), true));
  });

  it('sanitizes to default()', async () => {
    sanitizers.default(5);
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
    const defaultSanitizer = context.stack[0];

    await defaultSanitizer.run(context, 'foo', meta);
    expect(context.getData()[0].value).toEqual('foo');

    await defaultSanitizer.run(context, 10, meta);
    expect(context.getData()[0].value).toEqual(10);

    await defaultSanitizer.run(context, '', meta);
    expect(context.getData()[0].value).toEqual(5);

    await defaultSanitizer.run(context, undefined, meta);
    expect(context.getData()[0].value).toEqual(5);

    await defaultSanitizer.run(context, null, meta);
    expect(context.getData()[0].value).toEqual(5);

    await defaultSanitizer.run(context, NaN, meta);
    expect(context.getData()[0].value).toEqual(5);
  });
});

describe('#replace()', () => {
  it('adds replace() sanitizer to the context', () => {
    const ret = sanitizers.replace([], 'defaultValue');

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new Sanitization(expect.any(Function), true));
  });

  it('sanitizes to replace with empty set', async () => {
    sanitizers.replace([], 'defaultValue');
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
    const replace = context.stack[0];

    await replace.run(context, '', meta);
    expect(context.getData()[0].value).toEqual('');

    await replace.run(context, undefined, meta);
    expect(context.getData()[0].value).toEqual(undefined);

    await replace.run(context, null, meta);
    expect(context.getData()[0].value).toEqual(null);

    await replace.run(context, NaN, meta);
    expect(context.getData()[0].value).toEqual(NaN);

    await replace.run(context, 'foo_', meta);
    expect(context.getData()[0].value).toEqual('foo_');

    await replace.run(context, 100, meta);
    expect(context.getData()[0].value).toEqual(100);
  });

  it('sanitizes to replace with custom set', async () => {
    sanitizers.replace(['foo', 'bar'], 'defaultValue');
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
    const replace = context.stack[0];

    await replace.run(context, 'foo', meta);
    expect(context.getData()[0].value).toEqual('defaultValue');

    await replace.run(context, 'bar', meta);
    expect(context.getData()[0].value).toEqual('defaultValue');

    await replace.run(context, undefined, meta);
    expect(context.getData()[0].value).toEqual(undefined);

    await replace.run(context, null, meta);
    expect(context.getData()[0].value).toEqual(null);

    await replace.run(context, NaN, meta);
    expect(context.getData()[0].value).toEqual(NaN);

    await replace.run(context, '_foo', meta);
    expect(context.getData()[0].value).toEqual('_foo');

    await replace.run(context, 100, meta);
    expect(context.getData()[0].value).toEqual(100);
  });

  it('sanitizes to replace with single value', async () => {
    sanitizers.replace('foo', 'defaultValue');
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
    const replace = context.stack[0];

    await replace.run(context, 'foo', meta);
    expect(context.getData()[0].value).toEqual('defaultValue');

    await replace.run(context, '_foo', meta);
    expect(context.getData()[0].value).toEqual('_foo');

    await replace.run(context, 100, meta);
    expect(context.getData()[0].value).toEqual(100);
  });
});
