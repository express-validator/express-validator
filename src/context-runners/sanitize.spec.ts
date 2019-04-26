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

  const sanitizer1 = jest.fn(value => value + '!!');
  context.addSanitization(sanitizer1, { custom: true });

  const sanitizer2 = jest.fn(value => 'wow, so much ' + value);
  context.addSanitization(sanitizer2, { custom: true });

  const instances = await runner.run(req, context, [{
    location: 'query',
    path: 'search',
    originalPath: 'search',
    value: 'result',
    originalValue: 'result',
  }]);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    value: 'wow, so much result!!',
  });
  expect(sanitizer1).toHaveBeenCalledWith('result', { req, location: 'query', path: 'search' });
  expect(sanitizer2).toHaveBeenCalledWith('result!!', { req, location: 'query', path: 'search' });
});

it('maps instances using standard sanitizers in the context', async () => {
  const context = new Context([], []);

  const sanitizer1 = jest.fn((value, suffix) => value + suffix);
  context.addSanitization(sanitizer1, { custom: false, options: ['!!'] });

  const sanitizer2 = jest.fn((value, prefix) => prefix + value);
  context.addSanitization(sanitizer2, { custom: false, options: ['wow, so much '] });

  const instances = await runner.run(req, context, [{
    location: 'query',
    path: 'search',
    originalPath: 'search',
    value: 'result',
    originalValue: 'result',
  }]);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    value: 'wow, so much result!!',
  });
  expect(sanitizer1).toHaveBeenCalledWith('result', '!!');
  expect(sanitizer2).toHaveBeenCalledWith('result!!', 'wow, so much ');
});

// FIXME https://github.com/express-validator/express-validator/issues/580
it('stops running sanitizers when value becomes non-string', async () => {
  const context = new Context([], []);
  context.addSanitization(() => 123, { custom: true });

  const sanitizer2 = jest.fn(value => value);
  context.addSanitization(sanitizer2, { custom: true });

  const instances = await runner.run(req, context, [{
    location: 'query',
    path: 'search',
    originalPath: 'search',
    value: 'result',
    originalValue: 'result',
  }]);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    value: 123,
  });
  expect(sanitizer2).not.toHaveBeenCalled();
});