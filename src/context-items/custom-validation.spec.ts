import { Context } from '../context';
import { ContextBuilder } from '../context-builder';
import { Meta } from '../base';
import { CustomValidation } from './custom-validation';

let context: Context;
let validator: jest.Mock;
let validation: CustomValidation;
const meta: Meta = {
  req: { cookies: { foo: 'bar' } },
  location: 'cookies',
  path: 'foo',
};

beforeEach(() => {
  context = new ContextBuilder().setFields(['foo']).setLocations(['cookies']).build();
  jest.spyOn(context, 'addError');

  validator = jest.fn();
});

// There are 4 tests that are pretty much the same with just small variations among them.
// So it's made reusable here
const createSyncTest = (options: { returnValue: any; addsError: boolean }) => async () => {
  validator.mockReturnValue(options.returnValue);
  await validation.run(context, 'bar', meta);
  if (options.addsError) {
    expect(context.addError).toHaveBeenCalledWith(validation.message, 'bar', meta);
  } else {
    expect(context.addError).not.toHaveBeenCalled();
  }
};

describe('when not negated', () => {
  beforeEach(() => {
    validation = new CustomValidation(validator, false);
    validation.message = 'nope';
  });

  it(
    'adds error if validator returns falsy',
    createSyncTest({ returnValue: false, addsError: true }),
  );

  it(
    'does not add error if validator returns truthy',
    createSyncTest({ returnValue: true, addsError: false }),
  );

  describe('with message set', () => {
    it('adds error with validation message if validator throws', async () => {
      validator.mockImplementation(() => {
        throw new Error('boom');
      });
      await validation.run(context, 'bar', meta);
      expect(context.addError).toHaveBeenCalledWith('nope', 'bar', meta);
    });

    it('adds error with validation message if validator returns a promise that rejects', async () => {
      validator.mockRejectedValue('a bomb');
      await validation.run(context, 'bar', meta);
      expect(context.addError).toHaveBeenCalledWith('nope', 'bar', meta);
    });
  });

  describe('without message set', () => {
    beforeEach(() => {
      validation.message = undefined;
    });

    it('adds error with thrown message if validator throws', async () => {
      validator.mockImplementation(() => {
        throw new Error('boom');
      });
      await validation.run(context, 'bar', meta);
      expect(context.addError).toHaveBeenCalledWith('boom', 'bar', meta);
    });

    it('adds error with rejection message if validator returns a promise that rejects', async () => {
      validator.mockRejectedValue('a bomb');
      await validation.run(context, 'bar', meta);
      expect(context.addError).toHaveBeenCalledWith('a bomb', 'bar', meta);
    });
  });

  it('does not add error if validator returns a promise that resolves', async () => {
    validator.mockResolvedValue(true);
    await validation.run(context, 'bar', meta);
    expect(context.addError).not.toHaveBeenCalled();
  });
});

describe('when negated', () => {
  beforeEach(() => {
    validation = new CustomValidation(validator, true);
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
    await validation.run(context, 'bar', meta);
    expect(context.addError).not.toHaveBeenCalled();
  });

  it('does not add error if validator returns a promise that rejects', async () => {
    validator.mockRejectedValue('a bomb');
    await validation.run(context, 'bar', meta);
    expect(context.addError).not.toHaveBeenCalled();
  });

  it('adds error with validation message if validator returns a promise that resolves', async () => {
    validator.mockResolvedValue(true);
    await validation.run(context, 'bar', meta);
    expect(context.addError).toHaveBeenCalledWith('nope', 'bar', meta);
  });
});
