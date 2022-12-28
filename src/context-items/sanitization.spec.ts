import { Context } from '../context';
import { Meta } from '../base';
import { ContextBuilder } from '../context-builder';
import { Sanitization } from './sanitization';

let context: Context;
let sanitizer: jest.Mock;
let sanitization: Sanitization;
let toString: jest.Mock;
const meta: Meta = {
  req: { cookies: { foo: 'bar' } },
  location: 'cookies',
  path: 'foo',
};

beforeEach(() => {
  context = new ContextBuilder().build();
  context.addFieldInstances([
    {
      location: 'cookies',
      path: 'foo',
      originalPath: 'foo',
      value: 123,
      originalValue: 123,
    },
  ]);
  jest.spyOn(context, 'setData');

  sanitizer = jest.fn();
  toString = jest.fn(val => val);
  sanitization = new Sanitization(sanitizer, true, [], toString);
});

it('persists sanitized value back into the context', async () => {
  sanitizer.mockReturnValue(1);
  await sanitization.run(context, 'foo', meta);

  expect(context.setData).toHaveBeenCalledWith(meta.path, 1, meta.location);
});

describe('when sanitizer is a custom one', () => {
  it('calls it with the value and the meta', async () => {
    await sanitization.run(context, 'foo', meta);

    expect(sanitizer).toHaveBeenCalledWith('foo', meta);
  });

  it('calls it with the value of an async function and the meta', async () => {
    sanitizer = jest.fn(async value => 'foo ' + value);
    sanitization = new Sanitization(sanitizer, true, [], toString);
    await sanitization.run(context, 'bar', meta);

    expect(sanitizer).toHaveBeenCalledWith('bar', meta);
    expect(context.getData()[0].value).toBe('foo bar');
  });
});

describe('when sanitizer is a standard one', () => {
  it('calls it with the stringified value of non-array field', async () => {
    toString.mockReturnValue('hey');
    sanitization = new Sanitization(sanitizer, false, [], toString);

    await sanitization.run(context, false, meta);
    expect(toString).toHaveBeenCalledWith(false);
    expect(sanitizer).toHaveBeenCalledWith('hey');
  });

  it('calls it for each item in array field', async () => {
    toString.mockImplementation(val => `hey${val}`);
    sanitization = new Sanitization(sanitizer, false, [], toString);

    await sanitization.run(context, [1, 42], meta);
    expect(toString).toHaveBeenNthCalledWith(1, 1);
    expect(sanitizer).toHaveBeenNthCalledWith(1, 'hey1');
    expect(toString).toHaveBeenNthCalledWith(2, 42);
    expect(sanitizer).toHaveBeenNthCalledWith(2, 'hey42');
  });

  it('calls it with the options', async () => {
    sanitization = new Sanitization(sanitizer, false, ['bar', false], toString);

    await sanitization.run(context, 'foo', meta);
    expect(sanitizer).toHaveBeenLastCalledWith('foo', 'bar', false);
  });
});
