import { ContextBuilder } from '../context-builder';
import { Meta } from '../base';
import { Context } from '../context';
import { StandardValidation } from './standard-validation';

let context: Context;
let validator: jest.Mock;
let validation: StandardValidation;
let toString: jest.Mock;
const meta: Meta = {
  req: { cookies: { foo: 'bar' } },
  location: 'cookies',
  path: 'foo',
};

beforeEach(() => {
  context = new ContextBuilder().build();
  jest.spyOn(context, 'addError');

  validator = jest.fn();
  toString = jest.fn(val => val);
  validation = new StandardValidation(validator, false, [], toString);
  validation.message = 'nope';
});

const createTest = (options: { returnValue: any; addsError: boolean }) => async () => {
  validator.mockReturnValue(options.returnValue);
  await validation.run(context, 'bar', meta);
  if (options.addsError) {
    expect(context.addError).toHaveBeenCalledWith(validation.message, 'bar', meta);
  } else {
    expect(context.addError).not.toHaveBeenCalled();
  }
};

it('calls the validator with the stringified value of non-array field', async () => {
  toString.mockReturnValue('hey');
  await validation.run(context, false, meta);
  expect(toString).toHaveBeenCalledWith(false);
  expect(validator).toHaveBeenCalledWith('hey');
});

it('calls the validator for each item in array field', async () => {
  toString.mockImplementation(val => `hey${val}`);
  await validation.run(context, [1, 42], meta);
  expect(toString).toHaveBeenNthCalledWith(1, 1);
  expect(validator).toHaveBeenNthCalledWith(1, 'hey1');
  expect(toString).toHaveBeenNthCalledWith(2, 42);
  expect(validator).toHaveBeenNthCalledWith(2, 'hey42');
});

it('calls the validator with the value and options', async () => {
  validation = new StandardValidation(validator, false, ['bar', true], toString);
  await validation.run(context, 'foo', meta);

  expect(validator).toHaveBeenCalledWith('foo', 'bar', true);
});

describe('when not negated', () => {
  it('adds error if validator returns falsy', createTest({ returnValue: false, addsError: true }));

  it(
    'does not add error if validator returns truthy',
    createTest({ returnValue: true, addsError: false }),
  );
});

describe('when negated', () => {
  beforeEach(() => {
    validation = new StandardValidation(validator, true, [], toString);
    validation.message = 'nope';
  });

  it('adds error if validator returns truthy', createTest({ returnValue: true, addsError: true }));

  it(
    'does not add error if validator returns falsy',
    createTest({ returnValue: false, addsError: false }),
  );
});
