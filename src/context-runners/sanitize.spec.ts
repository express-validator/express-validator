import { Sanitize } from './sanitize';
import { Request } from '../base';
import { Context } from '../context';

let runner: Sanitize;
let req: Request;
beforeEach(() => {
  req = {};
  runner = new Sanitize();
});

it('maps instances using custom sanitizers in the context', async () => {
  const context = new Context([], []);

  const sanitizer1 = jest.fn(value => value * 2);
  context.addSanitization(sanitizer1, { custom: true });

  const sanitizer2 = jest.fn(value => value * 4);
  context.addSanitization(sanitizer2, { custom: true });

  const instances = await runner.run(req, context, [
    {
      location: 'query',
      path: 'search',
      originalPath: 'search',
      value: 2,
      originalValue: 2,
    },
  ]);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    value: 16,
  });

  // #580, #630, #632, #641 - Sanitization of non-string params
  expect(sanitizer1).toHaveBeenCalledWith(2, { req, location: 'query', path: 'search' });
  expect(sanitizer2).toHaveBeenCalledWith(4, { req, location: 'query', path: 'search' });
});

it('maps instances using standard sanitizers in the context', async () => {
  const context = new Context([], []);

  const sanitizer1 = jest.fn((value, suffix) => value + suffix);
  context.addSanitization(sanitizer1, { custom: false, options: ['!!'] });

  const sanitizer2 = jest.fn((value, prefix) => prefix + value);
  context.addSanitization(sanitizer2, { custom: false, options: ['wow, so much '] });

  const instances = await runner.run(req, context, [
    {
      location: 'query',
      path: 'search',
      originalPath: 'search',
      value: true,
      originalValue: true,
    },
  ]);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    value: 'wow, so much true!!',
  });

  // #580, #630, #632, #641 - Sanitization of non-string params
  expect(sanitizer1).toHaveBeenCalledWith('true', '!!');
  expect(sanitizer2).toHaveBeenCalledWith('true!!', 'wow, so much ');
});
