import { checkSchema } from "./schema";

it('creates a validation chain for each field in the schema', () => {
  const chains = checkSchema({
    foo: { isInt: true },
    bar: { isAlpha: true },
  });

  expect(chains).toHaveLength(2);
  expect(chains[0].context.fields).toEqual(['foo']);
  expect(chains[1].context.fields).toEqual(['bar']);
});

it('creates chain with an error message', () => {
  const chain = checkSchema({
    foo: {
      errorMessage: 'bar',
    },
  })[0];

  expect(chain.context.message).toBe('bar');
});

describe('locations', () => {
  it('includes by default all of them', () => {
    const chain = checkSchema({
      foo: {},
    })[0];

    expect(chain.context.locations).toEqual([
      'body',
      'cookies',
      'headers',
      'params',
      'query',
    ]);
  });

  it('includes all of the specified ones', () => {
    const chain = checkSchema({
      foo: {},
    }, ['headers', 'cookies'])[0];

    expect(chain.context.locations).toEqual(['headers', 'cookies']);
  });

  it('includes location in "in" when string', () => {
    const chain = checkSchema({
      foo: {
        in: 'body',
      },
    })[0];

    expect(chain.context.locations).toEqual(['body']);
  });

  it('includes locations in "in" when array', () => {
    const chain = checkSchema({
      foo: {
        in: ['params', 'body'],
      },
    })[0];

    expect(chain.context.locations).toEqual(['params', 'body']);
  });
});

describe('on each field', () => {
  it('adds known validators/sanitizers', () => {
    const chain = checkSchema({
      foo: {
        errorMessage: 'bla',
        isInt: true,
        isBla: true,
        escape: true,
      } as any, // as any because of JS consumers doing the wrong thing
    })[0];

    expect(chain.context.validations).toHaveLength(1);
    expect(chain.context.sanitizations).toHaveLength(1);
  });

  it('adds with options', () => {
    const chain = checkSchema({
      foo: {
        custom: {
          options: value => value > 0,
        },
        whitelist: {
          options: ['a'],
        },
      },
    })[0];

    const customValidation = chain.context.validations[0];
    if (!customValidation.custom) {
      // Should have been added as a custom validation
      throw new Error();
    }

    const customValidationResult = customValidation.validator(1, {
      req: {},
      path: 'foo',
      location: 'body',
    });
    expect(customValidationResult).toBe(true);

    const sanitizer = chain.context.sanitizations[0];
    if (sanitizer.custom) {
      // Shouldn't have been added as a custom sanitization
      throw new Error();
    }

    expect(sanitizer.options).toEqual(['a']);
  });

  it('sets error message', () => {
    const chain = checkSchema({
      foo: {
        isInt: {
          errorMessage: 'bla',
        },
      },
    })[0];

    expect(chain.context.validations[0].message).toBe('bla');
  });

  it('does not set error message from non-validators', () => {
    const chain = checkSchema({
      foo: {
        isInt: {
          errorMessage: 'from toInt',
        },
        optional: {
          errorMessage: 'from optional',
        },
        toInt: {
          errorMessage: 'from toInt',
        },
      } as any, // as any because of JS consumers doing the wrong thing
    })[0];

    const isInt = chain.context.validations[0];
    expect(isInt.message).toBe('from toInt');
  });

  it('can be marked as optional', () => {
    const chain = checkSchema({
      foo: {
        optional: true,
      },
    })[0];

    expect(chain.context.optional).toEqual({
      checkFalsy: false,
      nullable: false,
    });
  });

  it('can negate validators', () => {
    const chain = checkSchema({
      foo: {
        isEmpty: {
          negated: true,
        },
      },
    })[0];

    expect(chain.context.validations[0].negated).toBe(true);
  });
});