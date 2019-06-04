import { Context } from './context';
import { FieldInstance, Meta } from './base';
import { ContextItem } from './context-items';

let context: Context;
let data: FieldInstance[];

beforeEach(() => {
  context = new Context();
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
  it('pushes an error with default error message', () => {
    context.addError(null, 'foo', {
      path: 'bar',
      location: 'headers',
      req: {},
    });

    expect(context.errors).toHaveLength(1);
    expect(context.errors).toContainEqual({
      value: 'foo',
      msg: 'Invalid value',
      param: 'bar',
      location: 'headers',
    });
  });

  it('pushes an error with context message', () => {
    context = new Context('context message');
    context.addError(null, 'foo', {
      path: 'bar',
      location: 'headers',
      req: {},
    });

    expect(context.errors).toHaveLength(1);
    expect(context.errors).toContainEqual({
      value: 'foo',
      msg: 'context message',
      param: 'bar',
      location: 'headers',
    });
  });

  it('pushes an error with argument message', () => {
    context.addError('oh noes', 'foo', {
      path: 'bar',
      location: 'headers',
      req: {},
    });

    expect(context.errors).toHaveLength(1);
    expect(context.errors).toContainEqual({
      value: 'foo',
      msg: 'oh noes',
      param: 'bar',
      location: 'headers',
    });
  });

  it('pushes an error with the message function return ', () => {
    const meta: Meta = {
      path: 'bar',
      location: 'headers',
      req: {},
    };
    const message = jest.fn(() => 123);
    context.addError(message, 'foo', meta);

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

describe('#addItem()', () => {
  it('pushes item to the stack', () => {
    const item1: ContextItem = {
      kind: 'validation',
      message: 'bla',
      run: () => Promise.resolve(),
    };
    const item2: ContextItem = {
      kind: 'unknown',
      run: () => Promise.resolve(),
    };
    context.addItem(item1);
    context.addItem(item2);

    expect(context.stack).toHaveLength(2);
    expect(context.stack).toEqual([item1, item2]);
  });

  it('resets #negated', () => {
    context.negate();
    context.addItem({
      kind: 'unknown',
      run: () => Promise.resolve(),
    });

    expect(context.negated).toBe(false);
  });
});

describe('#addFieldInstance()', () => {
  it('adds data to the context', () => {
    context.addFieldInstances(data);
    expect(context.getData()).toEqual({
      [data[0].path]: data[0],
      [data[1].path]: data[1],
    });
  });
});

describe('#getData()', () => {
  it('returns all data when context not optional', () => {
    context.addFieldInstances(data);
    expect(context.getData()).toEqual({
      [data[0].path]: data[0],
      [data[1].path]: data[1],
    });
  });

  it('filters out undefineds when context optional', () => {
    data[0].value = undefined;
    context.setOptional();
    context.addFieldInstances(data);

    expect(context.getData({ requiredOnly: true })).toEqual({
      [data[1].path]: data[1],
    });
  });

  it('filters out undefineds and nulls when context optional with nullable = true', () => {
    data[0].value = null;
    data[1].value = undefined;

    context.setOptional({ nullable: true });
    context.addFieldInstances(data);

    expect(context.getData({ requiredOnly: true })).toEqual({});
  });

  it('filters out falsies when context optional with checkFalsy = true', () => {
    data[0].value = null;
    data[1].value = undefined;
    data.push({ ...data[0], value: 0 }, { ...data[0], value: false }, { ...data[0], value: '' });

    context.setOptional({ checkFalsy: true });
    context.addFieldInstances(data);

    expect(context.getData({ requiredOnly: true })).toEqual({});
  });

  describe('when same path occurs multiple times', () => {
    it('keeps only fields with value', () => {
      data = [
        { ...data[0], value: undefined, location: 'body' },
        { ...data[0], value: 'boo', location: 'cookies' },
      ];

      context.addFieldInstances(data);

      expect(context.getData()).toEqual({
        [data[1].path]: data[1],
      });
    });

    it('filters out from the second undefined onwards if all values are undefined', () => {
      data = [
        { ...data[0], value: undefined, location: 'body' },
        { ...data[0], value: undefined, location: 'cookies' },
      ];

      context.addFieldInstances(data);

      expect(context.getData()).toEqual({
        [data[0].path]: data[0],
      });
    });

    it('does not filter out second undefined when it contains a wildcard', () => {
      data = [
        { ...data[0], originalPath: '*', value: undefined, location: 'body' },
        { ...data[0], originalPath: '*', value: undefined, location: 'cookies' },
      ];

      context.addFieldInstances(data);

      expect(context.getData()).toEqual({
        [data[0].path]: data[0],
        [data[1].path]: data[1],
      });
    });
  });
});

describe('#setData()', () => {
  it('overrides the value of an existing field instance', () => {
    context.addFieldInstances(data);
    context.setData(data[0].path, 'bla', data[0].location);

    expect(context.getData()).toHaveProperty(data[0].path, {
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

describe('#negate()', () => {
  it('sets #negated to true', () => {
    context.negate();
    expect(context).toHaveProperty('negated', true);
  });
});

describe('#setOptional()', () => {
  it('sets #optional to { checkFalsy: false, nullable: false } if arg is true', () => {
    context.setOptional(true);
    expect(context).toHaveProperty('optional', {
      checkFalsy: false,
      nullable: false,
    });
  });

  it('sets #optional to arg value', () => {
    context.setOptional({ nullable: true });
    expect(context).toHaveProperty('optional', {
      checkFalsy: false,
      nullable: true,
    });

    context.setOptional({ checkFalsy: true });
    expect(context).toHaveProperty('optional', {
      checkFalsy: true,
      nullable: false,
    });
  });

  it('sets #optional to false if arg is false', () => {
    context.setOptional(false);
    expect(context).toHaveProperty('optional', false);
  });
});
