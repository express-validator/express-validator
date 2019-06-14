import { Context } from '../context';
import { Meta } from '../base';
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
  context = new Context(['foo'], ['cookies']);
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
  sanitization = new Sanitization(context, sanitizer, true);
});

it('persists sanitized value back into the context', async () => {
  sanitizer.mockReturnValue(1);
  await sanitization.run('foo', meta);

  expect(context.setData).toHaveBeenCalledWith(meta.path, 1, meta.location);
});

it('persists sanitized value back into the request', async () => {
  // With a non-empty path
  sanitizer.mockReturnValue(1);
  await sanitization.run('foo', meta);
  expect(meta.req.cookies).toHaveProperty(meta.path, 1);

  // With an empty path (e.g. whole body sanitization)
  context.addFieldInstances([
    {
      location: 'cookies',
      path: '',
      originalPath: '',
      value: {},
      originalValue: {},
    },
  ]);
  await sanitization.run('foo', {
    ...meta,
    path: '',
  });
  expect(meta.req.cookies).toBe(1);
});

it('does not persist sanitized value back into the request if they are the same', async () => {
  sanitizer.mockReturnValue(undefined);
  await sanitization.run(undefined, meta);

  expect(meta.req.cookies).not.toHaveProperty(meta.path);
});

describe('when sanitizer is a custom one', () => {
  it('calls it with the value and the meta', async () => {
    await sanitization.run('foo', meta);

    expect(sanitizer).toHaveBeenCalledWith('foo', meta);
  });
});

describe('when sanitizer is a standard one', () => {
  it('calls it with the value as a string', async () => {
    sanitization = new Sanitization(context, sanitizer, false);

    await sanitization.run(false, meta);
    expect(sanitizer).toHaveBeenLastCalledWith('false');

    await sanitization.run(42, meta);
    expect(sanitizer).toHaveBeenLastCalledWith('42');

    // new Date(Date.UTC()) makes sure we'll not have to deal with timezones
    await sanitization.run(new Date(Date.UTC(2019, 4, 1, 10, 30, 50, 0)), meta);
    expect(sanitizer).toHaveBeenLastCalledWith('2019-05-01T10:30:50.000Z');

    await sanitization.run(null, meta);
    expect(sanitizer).toHaveBeenLastCalledWith('');

    await sanitization.run(undefined, meta);
    expect(sanitizer).toHaveBeenLastCalledWith('');

    await sanitization.run([42, 1], meta);
    expect(sanitizer).toHaveBeenLastCalledWith('42');
  });

  it('calls it with the options', async () => {
    sanitization = new Sanitization(context, sanitizer, false, ['bar', false]);

    await sanitization.run('foo', meta);
    expect(sanitizer).toHaveBeenLastCalledWith('foo', 'bar', false);
  });
});
