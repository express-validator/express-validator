import { ContextBuilder } from '../context-builder';
import { ValidationHalt } from '../base';
import { Bail } from './bail';

it('does not throw if the context has no errors', () => {
  const context = new ContextBuilder().build();
  return expect(new Bail().run(context)).resolves.toBeUndefined();
});

it('throws a validation halt if the context has errors', () => {
  const context = new ContextBuilder().build();
  context.addError('foo', 'value', {
    req: {},
    location: 'body',
    path: 'bar',
  });

  expect(() => new Bail().run(context)).toThrowError(ValidationHalt);
});
