import { Context } from '../context';
import { ContextBuilder } from '../context-builder';
import { Meta } from '../base';
import { RenameFieldContextItem } from './rename-field';

let context: Context;
let validator: jest.Mock;
let validation: RenameFieldContextItem;
let meta: Meta;

beforeEach(() => {
  jest.spyOn(context, 'addError');
  validator = jest.fn();
});

const createSyncTest = (options: { returnValue: any; isWildcard: boolean }) => async () => {
  validator.mockReturnValue(options.returnValue);
  await validation.run(context, options.returnValue, meta);
  if (options.isWildcard) {
    expect(context.getData()).toStrictEqual([
      {
        location: 'body',
        path: 'bar.foo',
        originalPath: 'bar.foo',
        value: 'Hello World!',
        originalValue: 123,
      },
    ]);
  } else {
    expect(context.getData()).toStrictEqual([
      {
        location: 'body',
        path: 'bar',
        originalPath: 'bar',
        value: 'Hello World!',
        originalValue: 123,
      },
    ]);
  }
};

describe('Rename wildcard paths', () => {
  beforeAll(() => {
    meta = {
      req: { body: { foo: { bar: 'foobar' } } },
      location: 'body',
      path: 'foo.bar',
    };
    context = new ContextBuilder().setFields(['foo.bar']).setLocations(['body']).build();
  });
  beforeEach(() => {
    context.addFieldInstances([
      {
        location: 'body',
        path: 'foo.bar',
        originalPath: 'foo.bar',
        value: 'Hello World!',
        originalValue: 123,
      },
    ]);
    validation = new RenameFieldContextItem(validator);
  });
  it(
    'Renames the field foo.bar to bar.foo',
    createSyncTest({ returnValue: 'bar.foo', isWildcard: true }),
  );
  it('Renames the wildcard field with nested objects and arrays', async () => {
    meta = {
      req: { body: { bar: [{ foo: { end: 'Hello World!' } }] } },
      location: 'body',
      path: 'bar.*.foo.end',
    };
    context = new ContextBuilder().setFields(['bar.*.foo.end']).setLocations(['body']).build();
    context.addFieldInstances([
      {
        location: 'body',
        path: 'bar.*.foo.end',
        originalPath: 'bar.*.foo.end',
        value: 'Hello World!',
        originalValue: 123,
      },
    ]);
    validator.mockReturnValue('foo.*.bar.*.child.new_field');
    await validation.run(context, 'foo.*.bar.*.child.new_field', meta);
    expect(context.getData()).toStrictEqual([
      {
        location: 'body',
        path: 'foo[0].bar[0].child.new_field',
        originalPath: 'foo.*.bar.*.child.new_field',
        value: 'Hello World!',
        originalValue: 123,
      },
    ]);
  });
});

describe('Rename non-wildcard fields', () => {
  beforeAll(() => {
    meta = {
      req: { body: { foo: 'Hello World!' } },
      location: 'body',
      path: 'foo',
    };
    context = new ContextBuilder().setFields(['foo']).setLocations(['body']).build();
  });
  beforeEach(() => {
    context.addFieldInstances([
      {
        location: 'body',
        path: 'foo',
        originalPath: 'foo',
        value: 'Hello World!',
        originalValue: 123,
      },
    ]);
    validation = new RenameFieldContextItem(validator);
  });
  it('Renames the field foo to bar', createSyncTest({ returnValue: 'bar', isWildcard: false }));
});
