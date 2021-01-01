import * as validator from 'validator';
import { Meta } from '../base';
import { CustomValidation, StandardValidation } from '../context-items';
import { ContextBuilder } from '../context-builder';
import { Validators } from './validators';
import { ValidatorsImpl } from './validators-impl';

let chain: any;
let builder: ContextBuilder;
let validators: Validators<any>;

beforeEach(() => {
  chain = {};
  builder = new ContextBuilder();
  jest.spyOn(builder, 'addItem');

  validators = new ValidatorsImpl(builder, chain);
});

it('has methods for all standard validators', () => {
  // Cast is here to workaround the lack of index signature
  const validatorModule = validator as any;

  Object.keys(validator)
    .filter((key): key is keyof Validators<any> => {
      return key.startsWith('is') && typeof validatorModule[key] === 'function';
    })
    .forEach(key => {
      expect(validators).toHaveProperty(key);

      const ret = validators[key].call(validators);
      expect(ret).toBe(chain);
      expect(builder.addItem).toHaveBeenCalledWith(
        new StandardValidation(validatorModule[key], false, expect.any(Array)),
      );
    });

  validators.contains('foo');
  expect(builder.addItem).toHaveBeenCalledWith(
    new StandardValidation(validator.contains, false, ['foo', undefined]),
  );

  validators.equals('bar');
  expect(builder.addItem).toHaveBeenCalledWith(
    new StandardValidation(validator.equals, false, ['bar']),
  );

  validators.matches('baz');
  expect(builder.addItem).toHaveBeenCalledWith(
    new StandardValidation(validator.matches, false, ['baz', undefined]),
  );
});

describe('#custom()', () => {
  it('adds custom validator to the context', () => {
    const validator = jest.fn();
    const ret = validators.custom(validator);

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new CustomValidation(validator, false));
  });
});

describe('#exists()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.exists();

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new CustomValidation(expect.any(Function), false));
  });

  it('checks if context is not undefined by default', async () => {
    validators.exists();
    const context = builder.build();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.stack[0];

    await exists.run(context, undefined, meta);
    await exists.run(context, null, meta);
    await exists.run(context, 0, meta);
    await exists.run(context, '', meta);
    await exists.run(context, false, meta);

    expect(context.errors).toHaveLength(1);
  });

  it('checks if context is not falsy when checkFalsy is true', async () => {
    validators.exists({ checkFalsy: true });
    const context = builder.build();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.stack[0];

    await exists.run(context, undefined, meta);
    await exists.run(context, null, meta);
    await exists.run(context, 0, meta);
    await exists.run(context, '', meta);
    await exists.run(context, false, meta);
    await exists.run(context, true, meta);

    expect(context.errors).toHaveLength(5);
  });

  it('checks if context is not null when checkNull is true', async () => {
    validators.exists({ checkNull: true });
    const context = builder.build();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const exists = context.stack[0];

    await exists.run(context, undefined, meta);
    await exists.run(context, null, meta);
    expect(context.errors).toHaveLength(2);

    await exists.run(context, 0, meta);
    await exists.run(context, '', meta);
    await exists.run(context, false, meta);
    await exists.run(context, true, meta);
    expect(context.errors).toHaveLength(2);
  });
});

describe('#isAlpha()', () => {
  it('checks options.ignore transformation from string[] to string', () => {
    const ret = validators.isAlpha('it-IT', { ignore: ['b', 'a', 'r'] });

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(
      new StandardValidation(validator.isAlpha, false, ['it-IT', { ignore: 'bar' }]),
    );
  });
});

describe('#isString()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.isString();

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new CustomValidation(expect.any(Function), false));
  });

  it('checks if context is string', async () => {
    validators.isString();
    const context = builder.build();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const isString = context.stack[0];

    await isString.run(context, 'foo', meta);
    expect(context.errors).toHaveLength(0);

    await isString.run(context, 1, meta);
    await isString.run(context, true, meta);
    await isString.run(context, null, meta);
    await isString.run(context, undefined, meta);
    await isString.run(context, [], meta);
    expect(context.errors).toHaveLength(5);
  });
});

describe('#isArray()', () => {
  it('adds custom validator to the context', () => {
    const ret = validators.isArray();

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(new CustomValidation(expect.any(Function), false));
  });

  it('checks if context is array', async () => {
    validators.isArray();
    const context = builder.build();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const isArray = context.stack[0];

    await isArray.run(context, [], meta);
    expect(context.errors).toHaveLength(0);

    await isArray.run(context, 1, meta);
    await isArray.run(context, true, meta);
    await isArray.run(context, null, meta);
    await isArray.run(context, undefined, meta);
    await isArray.run(context, 'foo', meta);
    expect(context.errors).toHaveLength(5);
  });

  it('checks if context is array of right length', async () => {
    validators.isArray({ min: 2, max: 5 });
    const context = builder.build();

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const isArray = context.stack[0];

    await isArray.run(context, [1, '2'], meta);
    await isArray.run(context, ['1', undefined, '3'], meta);
    await isArray.run(context, ['1', null, '3', '4', '5'], meta);
    expect(context.errors).toHaveLength(0);

    await isArray.run(context, [], meta);
    await isArray.run(context, ['1'], meta);
    await isArray.run(context, ['1', '2', '3', '4', '5', '6'], meta);
    expect(context.errors).toHaveLength(3);
  });
});

describe('#notEmpty()', () => {
  it('adds negated isEmpty() validator to the context', () => {
    const ret = validators.notEmpty();

    expect(ret).toBe(chain);
    expect(builder.addItem).toHaveBeenCalledWith(
      new StandardValidation(validator.isEmpty, true, expect.any(Array)),
    );
  });
});
