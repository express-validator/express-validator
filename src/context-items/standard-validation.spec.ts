import { ContextBuilder } from '../context-builder';
import { Meta } from '../base';
import { Context } from '../context';
import { StandardValidation } from './standard-validation';

let context: Context;
let validator: jest.Mock;
let validation: StandardValidation;
const meta: Meta = {
  req: { cookies: { foo: 'bar' } },
  location: 'cookies',
  path: 'foo',
};

beforeEach(() => {
  context = new ContextBuilder().build();
  jest.spyOn(context, 'addError');

  validator = jest.fn();
  validation = new StandardValidation(validator, false);
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

it('calls the validator with the value as a string', async () => {
  await validation.run(context, false, meta);
  expect(validator).toHaveBeenLastCalledWith('false');

  await validation.run(context, 42, meta);
  expect(validator).toHaveBeenLastCalledWith('42');

  // new Date(Date.UTC()) makes sure we'll not have to deal with timezones
  await validation.run(context, new Date(Date.UTC(2019, 4, 1, 10, 30, 50, 0)), meta);
  expect(validator).toHaveBeenLastCalledWith('2019-05-01T10:30:50.000Z');

  await validation.run(context, null, meta);
  expect(validator).toHaveBeenLastCalledWith('');

  await validation.run(context, undefined, meta);
  expect(validator).toHaveBeenLastCalledWith('');

  await validation.run(context, [42, 1], meta);
  expect(validator).toHaveBeenLastCalledWith('42');

  await validation.run(context, { toString: () => 'wow' }, meta);
  expect(validator).toHaveBeenLastCalledWith('wow');
});

it('calls the validator with the options', async () => {
  validation = new StandardValidation(validator, false, ['bar', true]);
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
    validation = new StandardValidation(validator, true);
    validation.message = 'nope';
  });

  it('adds error if validator returns truthy', createTest({ returnValue: true, addsError: true }));

  it(
    'does not add error if validator returns falsy',
    createTest({ returnValue: false, addsError: false }),
  );
});
