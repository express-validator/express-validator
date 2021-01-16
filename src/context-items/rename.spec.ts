import { ContextBuilder } from '../context-builder';
import { Meta } from '../base';
import { Rename } from './rename';

it('the new path is identical to the old one', () => {
  const context = new ContextBuilder().setFields(['foo']).build();
  const meta: Meta = { req: {}, location: 'body', path: 'foo' };

  expect(new Rename('foo').run(context, 'value', meta)).resolves;
});

it('throws an error if trying to rename more than one field', async () => {
  const context = new ContextBuilder().setFields(['foo', 'bar']).build();
  const meta: Meta = { req: {}, location: 'body', path: 'foo' };

  await expect(new Rename('_foo').run(context, 'value', meta)).rejects.toThrow();
});

it('throws an error if using wildcards in new path', async () => {
  const context = new ContextBuilder().setFields(['foo']).build();
  const meta: Meta = { req: {}, location: 'body', path: 'foo' };

  await expect(new Rename('foo.*').run(context, 'value', meta)).rejects.toThrow();
});

it('throws an error if the new path is already assigned to a property', async () => {
  const context = new ContextBuilder().setFields(['foo']).build();
  const meta: Meta = {
    req: {
      body: {
        foo: 'value',
        _foo: 'bar',
      },
    },
    location: 'body',
    path: 'foo',
  };

  await expect(new Rename('_foo').run(context, 'value', meta)).rejects.toThrow();
});

it('throws an error if trying to rename to an existing property', () => {
  const context = new ContextBuilder().setFields(['foo']).build();
  const meta: Meta = {
    req: {
      body: {
        foo: 'value',
      },
    },
    location: 'body',
    path: 'foo',
  };

  expect(new Rename('_foo').run(context, 'value', meta)).resolves;
  expect(meta.req.body).toEqual({
    _foo: 'value',
  });
});
