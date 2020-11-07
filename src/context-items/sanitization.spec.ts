import { Context } from '../context';
import { Meta } from '../base';
import { ContextBuilder } from '../context-builder';
import { Sanitization } from './sanitization';

let context: Context;
let sanitizer: jest.Mock;
let sanitization: Sanitization;
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
  sanitization = new Sanitization(sanitizer, true);
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
    sanitization = new Sanitization(sanitizer, true);
    await sanitization.run(context, 'bar', meta);

    expect(sanitizer).toHaveBeenCalledWith('bar', meta);
    expect(context.getData()[0].value).toBe('foo bar');
  });
});

describe('when sanitizer is a standard one', () => {
  it('calls it with the value as a string', async () => {
    sanitization = new Sanitization(sanitizer, false);

    await sanitization.run(context, false, meta);
    expect(sanitizer).toHaveBeenLastCalledWith('false');

    await sanitization.run(context, 42, meta);
    expect(sanitizer).toHaveBeenLastCalledWith('42');

    // new Date(Date.UTC()) makes sure we'll not have to deal with timezones
    await sanitization.run(context, new Date(Date.UTC(2019, 4, 1, 10, 30, 50, 0)), meta);
    expect(sanitizer).toHaveBeenLastCalledWith('2019-05-01T10:30:50.000Z');

    await sanitization.run(context, null, meta);
    expect(sanitizer).toHaveBeenLastCalledWith('');

    await sanitization.run(context, undefined, meta);
    expect(sanitizer).toHaveBeenLastCalledWith('');

    await sanitization.run(context, [42, 1], meta);
    expect(sanitizer).toHaveBeenLastCalledWith('42');

    await sanitization.run(context, { toString: () => 'wow' }, meta);
    expect(sanitizer).toHaveBeenLastCalledWith('wow');
  });

  it('calls it with the options', async () => {
    sanitization = new Sanitization(sanitizer, false, ['bar', false]);

    await sanitization.run(context, 'foo', meta);
    expect(sanitizer).toHaveBeenLastCalledWith('foo', 'bar', false);
  });
});
