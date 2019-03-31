import { Validate } from './validate';
import { Request } from '../base';
import { Context } from '../context';
import { FieldInstance } from './context-runner';

let req: Request;
let runner: Validate;
let fieldInstances: FieldInstance[];

beforeEach(() => {
  req = {};
  fieldInstances = [{
    location: 'body',
    path: 'foo',
    originalPath: 'foo',
    value: 123,
    originalValue: '123',
  }, {
    location: 'query',
    path: 'bar',
    originalPath: 'bar',
    value: 'bazbaz',
    originalValue: 'baz',
  }];
  runner = new Validate();
});

it('runs standard validators in the context on every field instance', async () => {
  const context = new Context([], []);
  const validator = jest.fn(() => true);
  context.addValidation(validator, { custom: false, options: ['option'] });

  await runner.run(req, context, fieldInstances);

  expect(validator).toHaveBeenCalledTimes(fieldInstances.length);
  fieldInstances.forEach(instance => {
    expect(validator).toHaveBeenCalledWith(instance.value, 'option');
  });
});

it('runs custom validators in the context on every field instance', async () => {
  const context = new Context([], []);
  const validator = jest.fn(() => true);
  context.addValidation(validator, { custom: true });

  await runner.run(req, context, fieldInstances);

  expect(validator).toHaveBeenCalledTimes(fieldInstances.length);
  fieldInstances.forEach(instance => {
    expect(validator).toHaveBeenCalledWith(instance.value, {
      req,
      location: instance.location,
      path: instance.path,
    });
  });
});

it('throws errors if validator returns falsy', async () => {
  const context = new Context([], []);
  const validator = jest.fn(() => false);
  context.addValidation(validator, { custom: true });

  const expectation = expect.arrayContaining(fieldInstances.map(instance => expect.objectContaining({
    location: instance.location,
    param: instance.path,
    value: instance.originalValue,
  })));

  await expect(runner.run(req, context, fieldInstances)).rejects.toEqual(expectation);
});

it('throws errors if validator rejects', async () => {
  const context = new Context([], []);
  const validator = jest.fn(() => Promise.reject());
  context.addValidation(validator, { custom: true });

  const expectation = expect.arrayContaining(fieldInstances.map(instance => expect.objectContaining({
    location: instance.location,
    param: instance.path,
    value: instance.originalValue,
  })));

  await expect(runner.run(req, context, fieldInstances)).rejects.toEqual(expectation);
});

describe('error messages', () => {
  it('are by default "Invalid value"', async () => {
    const context = new Context([], []);
    context.addValidation(() => false, { custom: false });

    const expectation = expect.arrayContaining(fieldInstances.map(() => expect.objectContaining({
      msg: 'Invalid value',
    })));

    await expect(runner.run(req, context, fieldInstances)).rejects.toEqual(expectation);
  });

  it('can be the context message if defined', async () => {
    const context = new Context([], [], 'u fail');
    context.addValidation(() => false, { custom: false });

    const expectation = expect.arrayContaining(fieldInstances.map(() => expect.objectContaining({
      msg: 'u fail',
    })));

    await expect(runner.run(req, context, fieldInstances)).rejects.toEqual(expectation);
  });

  it('can be the error itself', async () => {
    const context = new Context([], [], 'u fail');
    context.addValidation(() => { throw 'nope :('; }, { custom: false });

    const expectation = expect.arrayContaining(fieldInstances.map(() => expect.objectContaining({
      msg: 'nope :(',
    })));

    await expect(runner.run(req, context, fieldInstances)).rejects.toEqual(expectation);
  });

  it('can be the message of an Error instance', async () => {
    const context = new Context([], [], 'u fail');
    context.addValidation(() => { throw new Error('nope :('); }, { custom: false });

    const expectation = expect.arrayContaining(fieldInstances.map(() => expect.objectContaining({
      msg: 'nope :(',
    })));

    await expect(runner.run(req, context, fieldInstances)).rejects.toEqual(expectation);
  });

  it('can be the validation message', async () => {
    const context = new Context([], [], 'u fail');
    context.addValidation(() => { throw new Error('nope :('); }, { custom: false });
    context.validations[0].message = 'dang';

    const expectation = expect.arrayContaining(fieldInstances.map(() => expect.objectContaining({
      msg: 'dang',
    })));

    await expect(runner.run(req, context, fieldInstances)).rejects.toEqual(expectation);
  });

  it('can be the return of a function', async () => {
    const message = jest.fn(() => 'bla');
    const context = new Context([], [], message);
    context.addValidation(() => false, { custom: false });

    const expectation = expect.arrayContaining(fieldInstances.map(() => expect.objectContaining({
      msg: 'bla',
    })));

    await expect(runner.run(req, context, fieldInstances)).rejects.toEqual(expectation);

    expect(message).toHaveBeenCalledTimes(2);
    fieldInstances.forEach(instance => {
      expect(message).toHaveBeenCalledWith(instance.originalValue, {
        req,
        location: instance.location,
        path: instance.path,
      });
    });
  });
});