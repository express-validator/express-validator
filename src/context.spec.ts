import { FieldInstance, FieldValidationError, Meta, UnknownFieldInstance } from './base';
import { AddErrorOptions, Context } from './context';
import { ContextBuilder } from './context-builder';

let context: Context;
let data: FieldInstance[];

beforeEach(() => {
  context = new ContextBuilder().build();
  data = [
    {
      location: 'body',
      originalPath: 'foo',
      path: 'foo',
      value: 123,
    },
    {
      location: 'params',
      originalPath: 'bar.baz',
      path: 'bar.baz',
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
      context.addError({ type: 'field', value: 'foo', meta });

      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        type: 'field',
        value: 'foo',
        msg: 'Invalid value',
        path: 'bar',
        location: 'headers',
      });
    });

    it('pushes an error with context message', () => {
      context = new ContextBuilder().setMessage('context message').build();
      context.addError({ type: 'field', value: 'foo', meta });

      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        type: 'field',
        value: 'foo',
        msg: 'context message',
        path: 'bar',
        location: 'headers',
      });
    });

    it('pushes an error with argument message', () => {
      context.addError({ type: 'field', message: 'oh noes', value: 'foo', meta });

      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        type: 'field',
        value: 'foo',
        msg: 'oh noes',
        path: 'bar',
        location: 'headers',
      });
    });

    it('pushes an error with the message function return ', () => {
      const message = jest.fn(() => 123);
      context.addError({ type: 'field', message, value: 'foo', meta });

      expect(message).toHaveBeenCalledWith('foo', meta);
      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        type: 'field',
        value: 'foo',
        msg: 123,
        path: 'bar',
        location: 'headers',
      });
    });
  });

  describe('for type alternative', () => {
    const req = {};
    const nestedError: FieldValidationError = {
      type: 'field',
      value: 'foo',
      path: 'bar',
      location: 'body',
      msg: 'Oh no',
    };

    it('pushes a request error with nested errors', () => {
      context.addError({
        type: 'alternative',
        req,
        nestedErrors: [nestedError],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        type: 'alternative',
        msg: 'Invalid value',
        nestedErrors: [nestedError],
      });
    });

    it('pushes an error with default error message', () => {
      context.addError({
        type: 'alternative',
        req,
        nestedErrors: [nestedError],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].msg).toBe('Invalid value');
    });

    it('pushes an error with argument message', () => {
      context.addError({
        type: 'alternative',
        req,
        message: 'oh noes',
        nestedErrors: [nestedError],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].msg).toBe('oh noes');
    });

    it('pushes an error with the message function return', () => {
      const message = jest.fn(() => 123);
      context.addError({
        type: 'alternative',
        req,
        message,
        nestedErrors: [nestedError],
      });

      expect(message).toHaveBeenCalledWith([nestedError], { req });
      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].msg).toBe(123);
    });
  });

  describe('for type alternative_grouped', () => {
    const req = {};
    const nestedError: FieldValidationError = {
      type: 'field',
      value: 'foo',
      path: 'bar',
      location: 'body',
      msg: 'Oh no',
    };

    it('pushes a request error with nested errors', () => {
      context.addError({
        type: 'alternative_grouped',
        req,
        nestedErrors: [[nestedError]],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors).toContainEqual({
        type: 'alternative_grouped',
        msg: 'Invalid value',
        nestedErrors: [[nestedError]],
      });
    });

    it('pushes an error with default error message', () => {
      context.addError({
        type: 'alternative_grouped',
        req,
        nestedErrors: [[nestedError]],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].msg).toBe('Invalid value');
    });

    it('pushes an error with argument message', () => {
      context.addError({
        type: 'alternative_grouped',
        req,
        message: 'oh noes',
        nestedErrors: [[nestedError]],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].msg).toBe('oh noes');
    });

    it('pushes an error with the message function return', () => {
      const message = jest.fn(() => 123);
      context.addError({
        type: 'alternative_grouped',
        req,
        message,
        nestedErrors: [[nestedError]],
      });

      expect(message).toHaveBeenCalledWith([[nestedError]], { req });
      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].msg).toBe(123);
    });
  });

  describe('for type unknown_fields', () => {
    const req = {};
    const unknownField: UnknownFieldInstance = {
      path: 'fruit',
      value: 'banana',
      location: 'cookies',
    };

    it('pushes an error with unknown fields', () => {
      context.addError({
        type: 'unknown_fields',
        req,
        fields: [unknownField],
      });

      expect(context.errors).toHaveLength(1);
      expect(context.errors[0]).toMatchObject({
        type: 'unknown_fields',
        fields: [unknownField],
      });
    });

    it('pushes an error with default error message', () => {
      context.addError({
        type: 'unknown_fields',
        req,
        fields: [unknownField],
      });

      expect(context.errors[0].msg).toBe('Invalid value');
    });

    it('pushes an error with argument message', () => {
      context.addError({
        type: 'unknown_fields',
        req,
        message: 'oh noes',
        fields: [unknownField],
      });

      expect(context.errors[0].msg).toBe('oh noes');
    });

    it('pushes an error with the message function return', () => {
      const message = jest.fn(() => 'keep trying');
      context.addError({
        type: 'unknown_fields',
        req,
        message,
        fields: [unknownField],
      });

      expect(context.errors[0].msg).toBe('keep trying');
      expect(message).toHaveBeenCalledWith([unknownField], { req });
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

  it('filters out undefineds when context optional = undefined', () => {
    data[0].value = undefined;
    context = new ContextBuilder().setOptional('undefined').build();
    context.addFieldInstances(data);

    expect(context.getData({ requiredOnly: true })).toEqual([data[1]]);
  });

  it('filters out undefineds and nulls when context optional = null', () => {
    data[0].value = null;
    data[1].value = undefined;

    context = new ContextBuilder().setOptional('null').build();
    context.addFieldInstances(data);

    expect(context.getData({ requiredOnly: true })).toEqual([]);
  });

  it('filters out falsies when context optional = falsy', () => {
    data[0].value = null;
    data[1].value = undefined;
    data.push({ ...data[0], value: 0 }, { ...data[0], value: false }, { ...data[0], value: '' });

    context = new ContextBuilder().setOptional('falsy').build();
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

describe('#hide()', () => {
  const meta: Meta = {
    path: 'bar',
    location: 'headers',
    req: {},
  };

  const error: AddErrorOptions = {
    type: 'field',
    value: 'my value',
    meta: meta,
  };

  it('calling hide() without hiddenValue', () => {
    const myContextBuilder = new ContextBuilder();
    myContextBuilder.setHiddenValue(true, '');
    const myContext = myContextBuilder.build();

    myContext.addError(error);

    expect(myContext.errors).toHaveLength(1);
    expect(myContext.errors).toEqual([
      { location: 'headers', msg: 'Invalid value', path: 'bar', type: 'field' },
    ]);
  });

  it('calling hide() with hiddenValue', () => {
    const myContextBuilder = new ContextBuilder();
    myContextBuilder.setHiddenValue(true, '[DO NOT EXPOSE]');
    const myContext = myContextBuilder.build();

    myContext.addError(error);

    expect(myContext.errors).toHaveLength(1);
    expect(myContext.errors).toEqual([
      {
        location: 'headers',
        msg: 'Invalid value',
        path: 'bar',
        type: 'field',
        value: '[DO NOT EXPOSE]',
      },
    ]);
  });
});
