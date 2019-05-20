import { Sanitize } from './sanitize';
import { Request } from '../base';
import { Context } from '../context';
import { FieldInstance } from './context-runner';

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
      value: 'result',
      originalValue: 'result',
    },
  ]);

  expect(instances).toHaveLength(1);
  expect(instances[0]).toMatchObject({
    value: 'wow, so much result!!',
  });
  expect(sanitizer1).toHaveBeenCalledWith('result', '!!');
  expect(sanitizer2).toHaveBeenCalledWith('result!!', 'wow, so much ');
});

describe('standard sanitizer string conversion', () => {
  let context: Context;
  let sanitizer: jest.Mock;
  let fieldInstances: FieldInstance[];

  beforeEach(() => {
    sanitizer = jest.fn(() => true);
    fieldInstances = [
      {
        location: 'query',
        path: 'search',
        originalPath: 'search',
        value: '',
        originalValue: '',
      },
      {
        location: 'query',
        path: 'type',
        originalPath: 'type',
        value: '',
        originalValue: '',
      },
    ];

    context = new Context([], []);
    context.addSanitization(sanitizer, { custom: false });
  });

  it('works from boolean', async () => {
    fieldInstances[0].value = true;
    fieldInstances[1].value = false;
    await runner.run(req, context, fieldInstances);

    expect(sanitizer).toHaveBeenCalledWith('true');
    expect(sanitizer).toHaveBeenCalledWith('false');
  });

  it('works from number', async () => {
    fieldInstances[0].value = 10;
    fieldInstances[1].value = 1.5;
    await runner.run(req, context, fieldInstances);

    expect(sanitizer).toHaveBeenCalledWith('10');
    expect(sanitizer).toHaveBeenCalledWith('1.5');
  });

  it('works from null, undefined and NaN', async () => {
    fieldInstances[0].value = null;
    fieldInstances[1].value = undefined;
    await runner.run(req, context, fieldInstances);

    expect(sanitizer).toHaveBeenNthCalledWith(1, '');
    expect(sanitizer).toHaveBeenNthCalledWith(2, '');
  });

  it('works from NaN', async () => {
    fieldInstances[0].value = NaN;
    await runner.run(req, context, fieldInstances);

    expect(sanitizer).toHaveBeenNthCalledWith(1, '');
  });

  it('works from Date', async () => {
    // new Date(Date.UTC()) makes sure we'll not have to deal with timezones
    fieldInstances[0].value = new Date(Date.UTC(2019, 4, 1, 10, 30, 50, 0));
    await runner.run(req, context, fieldInstances);

    expect(sanitizer).toHaveBeenCalledWith('2019-05-01T10:30:50.000Z');
  });

  it('works from array', async () => {
    fieldInstances[0].value = ['foo'];
    fieldInstances[1].value = ['foo', 'bar'];
    await runner.run(req, context, fieldInstances);

    expect(sanitizer).toHaveBeenNthCalledWith(1, 'foo');
    // TODO Should 2+ arrays be narrowed down to the first item of the array?
    expect(sanitizer).toHaveBeenNthCalledWith(2, 'foo');
  });

  it('works from object with toString', async () => {
    fieldInstances[0].value = {
      toString: () => 'bla',
    };
    await runner.run(req, context, fieldInstances);

    expect(sanitizer).toHaveBeenCalledWith('bla');
  });
});
