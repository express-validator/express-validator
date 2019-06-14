import { Context } from '../context';
import { StandardValidation } from './standard-validation';
import { Meta } from '../base';

let context: Context;
let validator: jest.Mock;
let validation: StandardValidation;
const meta: Meta = {
  req: { cookies: { foo: 'bar' } },
  location: 'cookies',
  path: 'foo',
};

beforeEach(() => {
  context = new Context(['foo'], ['cookies']);
  jest.spyOn(context, 'addError');

  validator = jest.fn();
  validation = new StandardValidation(context, validator);
  validation.message = 'nope';
});

const createTest = (options: { returnValue: any; addsError: boolean }) => async () => {
  validator.mockReturnValue(options.returnValue);
  await validation.run('bar', meta);
  if (options.addsError) {
    expect(context.addError).toHaveBeenCalledWith(validation.message, 'bar', meta);
  } else {
    expect(context.addError).not.toHaveBeenCalled();
  }
};

it('calls the validator with the value as a string', async () => {
  await validation.run(false, meta);
  expect(validator).toHaveBeenLastCalledWith('false');

  await validation.run(42, meta);
  expect(validator).toHaveBeenLastCalledWith('42');

  // new Date(Date.UTC()) makes sure we'll not have to deal with timezones
  await validation.run(new Date(Date.UTC(2019, 4, 1, 10, 30, 50, 0)), meta);
  expect(validator).toHaveBeenLastCalledWith('2019-05-01T10:30:50.000Z');

  await validation.run(null, meta);
  expect(validator).toHaveBeenLastCalledWith('');

  await validation.run(undefined, meta);
  expect(validator).toHaveBeenLastCalledWith('');

  await validation.run([42, 1], meta);
  expect(validator).toHaveBeenLastCalledWith('42');
});

it('calls the validator with the options', async () => {
  validation = new StandardValidation(context, validator, ['bar', true]);
  await validation.run('foo', meta);

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
    context.negate();

    validation = new StandardValidation(context, validator);
    validation.message = 'nope';
  });

  it('adds error if validator returns truthy', createTest({ returnValue: true, addsError: true }));

  it(
    'does not add error if validator returns falsy',
    createTest({ returnValue: false, addsError: false }),
  );
});
