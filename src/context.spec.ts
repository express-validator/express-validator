import { Context } from './context';
import { ContextBuilder } from './context-builder';
import { FieldInstance, Meta, ValidationError } from './base';

let context: Context;
let data: FieldInstance[];

beforeEach(() => {
  context = new ContextBuilder().build();
  data = [
    {
      location: 'body',
      originalPath: 'foo',
      path: 'foo',
      originalValue: 123,
      value: 123,
    },
    {
      location: 'params',
      originalPath: 'bar.baz',
      path: 'bar.baz',
      originalValue: 'false',
      value: false,
    },
  ];
});

describe('#addError()', () => {
  const meta: Meta = {
    path: 'bar',
    location: 'headers',
    req: {},
  };

  describe('for type single', () => {
    it('pushes an error with default error message', () => {
      context.addError({ type: 'single', value: 'foo', meta });

      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        value: 'foo',
        msg: 'Invalid value',
        param: 'bar',
        location: 'headers',
      });
    });

    it('pushes an error with context message', () => {
      context = new ContextBuilder().setMessage('context message').build();
      context.addError({ type: 'single', value: 'foo', meta });

      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        value: 'foo',
        msg: 'context message',
        param: 'bar',
        location: 'headers',
      });
    });

    it('pushes an error with argument message', () => {
      context.addError({ type: 'single', message: 'oh noes', value: 'foo', meta });

      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        value: 'foo',
        msg: 'oh noes',
        param: 'bar',
        location: 'headers',
      });
    });

    it('pushes an error with the message function return ', () => {
      const message = jest.fn(() => 123);
      context.addError({ type: 'single', message, value: 'foo', meta });

      expect(message).toHaveBeenCalledWith('foo', meta);
      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        value: 'foo',
        msg: 123,
        param: 'bar',
        location: 'headers',
      });
    });
  });

  describe('for type nested', () => {
    const nestedError: ValidationError = {
      value: 'foo',
      param: 'bar',
      location: 'body',
      msg: 'Oh no',
    };

    it('pushes an error for the _error param with nested errors', () => {
      context.addError({
        type: 'nested',
        nestedErrors: [nestedError],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].param).toBe('_error');
      expect(context.errors[0].nestedErrors).toEqual([nestedError]);
    });

    it('pushes an error with default error message', () => {
      context.addError({
        type: 'nested',
        nestedErrors: [nestedError],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].msg).toBe('Invalid value');
    });

    it('pushes an error with argument message', () => {
      context.addError({
        type: 'nested',
        message: 'oh noes',
        nestedErrors: [nestedError],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].msg).toBe('oh noes');
    });
  });

  it('throws if the error type is incorrect', () => {
    // The ts-expect-error below adds a static guarantee that we're indeed using a type that isn't
    // specified in the addError signature.
    // @ts-expect-error
    const fn = () => context.addError({ type: 'foo' });
    expect(fn).toThrow();
  });
});

describe('#addFieldInstance()', () => {
  it('adds data to the context', () => {
    context.addFieldInstances(data);
    expect(context.getData()).toEqual([data[0], data[1]]);
  });
});

describe('#getData()', () => {
  it('returns all data when context not optional', () => {
    context.addFieldInstances(data);
    expect(context.getData()).toEqual([data[0], data[1]]);
  });

  it('filters out undefineds when context optional', () => {
    data[0].value = undefined;
    context = new ContextBuilder().setOptional({ checkFalsy: false, nullable: false }).build();
    context.addFieldInstances(data);

    expect(context.getData({ requiredOnly: true })).toEqual([data[1]]);
  });

  it('filters out undefineds and nulls when context optional with nullable = true', () => {
    data[0].value = null;
    data[1].value = undefined;

    context = new ContextBuilder().setOptional({ checkFalsy: false, nullable: true }).build();
    context.addFieldInstances(data);

    expect(context.getData({ requiredOnly: true })).toEqual([]);
  });

  it('filters out falsies when context optional with checkFalsy = true', () => {
    data[0].value = null;
    data[1].value = undefined;
    data.push({ ...data[0], value: 0 }, { ...data[0], value: false }, { ...data[0], value: '' });

    context = new ContextBuilder().setOptional({ checkFalsy: true, nullable: false }).build();
    context.addFieldInstances(data);

    expect(context.getData({ requiredOnly: true })).toEqual([]);
  });

  describe('when same path occurs multiple times', () => {
    it('keeps only fields with value', () => {
      data = [
        { ...data[0], value: undefined, location: 'body' },
        { ...data[0], value: 'boo', location: 'cookies' },
      ];

      context.addFieldInstances(data);

      expect(context.getData()).toEqual([data[1]]);
    });

    it('filters out from the second undefined onwards if all values are undefined', () => {
      data = [
        { ...data[0], value: undefined, location: 'body' },
        { ...data[0], value: undefined, location: 'cookies' },
      ];

      context.addFieldInstances(data);

      expect(context.getData()).toEqual([data[0]]);
    });

    it('does not filter out second undefined when it contains a wildcard', () => {
      data = [
        { ...data[0], originalPath: '*', value: undefined, location: 'body' },
        { ...data[0], originalPath: '*', value: undefined, location: 'cookies' },
      ];

      context.addFieldInstances(data);

      expect(context.getData()).toEqual([data[0], data[1]]);
    });
  });
});

describe('#setData()', () => {
  it('overrides the value of an existing field instance', () => {
    context.addFieldInstances(data);
    context.setData(data[0].path, 'bla', data[0].location);

    expect(context.getData()).toContainEqual({
      ...data[0],
      value: 'bla',
    });
  });

  it('throws if trying to write new data', () => {
    const bomb = () => {
      context.setData(data[0].path, 'bla', data[0].location);
    };

    expect(bomb).toThrowError();
  });
});
