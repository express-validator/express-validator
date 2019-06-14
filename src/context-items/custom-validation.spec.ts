import { Context } from '../context';
import { CustomValidation } from './custom-validation';
import { Meta } from '../base';

let context: Context;
let validator: jest.Mock;
let validation: CustomValidation;
const meta: Meta = {
  req: { cookies: { foo: 'bar' } },
  location: 'cookies',
  path: 'foo',
};

beforeEach(() => {
  context = new Context(['foo'], ['cookies']);
  jest.spyOn(context, 'addError');

  validator = jest.fn();
  validation = new CustomValidation(context, validator);
  validation.message = 'nope';
});

// There are 4 tests that are pretty much the same with just small variations among them.
// So it's made reusable here
const createSyncTest = (options: { returnValue: any; addsError: boolean }) => async () => {
  validator.mockReturnValue(options.returnValue);
  await validation.run('bar', meta);
  if (options.addsError) {
    expect(context.addError).toHaveBeenCalledWith(validation.message, 'bar', meta);
  } else {
    expect(context.addError).not.toHaveBeenCalled();
  }
};

describe('when not negated', () => {
  it(
    'adds error if validator returns falsy',
    createSyncTest({ returnValue: false, addsError: true }),
  );

  it(
    'does not add error if validator returns truthy',
    createSyncTest({ returnValue: true, addsError: false }),
  );

  it('adds error if validator throws', async () => {
    // Thrown error's message
    validator.mockImplementation(() => {
      throw new Error('boom');
    });
    await validation.run('bar', meta);
    expect(context.addError).toHaveBeenCalledWith('boom', 'bar', meta);

    // Validation's message
    validator.mockImplementation(() => {
      throw new Error();
    });
    await validation.run('bar', meta);
    expect(context.addError).toHaveBeenCalledWith(validation.message, 'bar', meta);
  });

  it('adds error if validator returns a promise that rejects', async () => {
    // Rejection cause's message
    validator.mockRejectedValue('a bomb');
    await validation.run('bar', meta);
    expect(context.addError).toHaveBeenCalledWith('a bomb', 'bar', meta);

    // Validation's message
    validator.mockRejectedValue(undefined);
    await validation.run('bar', meta);
    expect(context.addError).toHaveBeenCalledWith(validation.message, 'bar', meta);
  });

  it('does not add error if validator returns a promise that resolves', async () => {
    validator.mockResolvedValue(true);
    await validation.run('bar', meta);
    expect(context.addError).not.toHaveBeenCalled();
  });
});

describe('when negated', () => {
  beforeEach(() => {
    context.negate();

    validation = new CustomValidation(context, validator);
    validation.message = 'nope';
  });

  it(
    'adds error if validator returns truthy',
    createSyncTest({ returnValue: true, addsError: true }),
  );

  it(
    'does not add error if validator returns falsy',
    createSyncTest({ returnValue: false, addsError: false }),
  );

  it('does not add error if validator throws', async () => {
    validator.mockImplementation(() => {
      throw new Error('boom');
    });
    await validation.run('bar', meta);
    expect(context.addError).not.toHaveBeenCalled();
  });

  it('does not add error if validator returns a promise that rejects', async () => {
    validator.mockRejectedValue('a bomb');
    await validation.run('bar', meta);
    expect(context.addError).not.toHaveBeenCalled();
  });

  it('adds error if validator returns a promise that resolves', async () => {
    validator.mockResolvedValue(true);
    await validation.run('bar', meta);
    expect(context.addError).toHaveBeenCalledWith(validation.message, 'bar', meta);
  });
});
