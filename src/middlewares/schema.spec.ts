import { ValidationChain } from '../chain';
import { checkSchema } from './schema';

const chainToContext = (chain: ValidationChain) => chain.builder.build();

it('creates a validation chain for each field in the schema', () => {
  const chains = checkSchema({
    foo: { isInt: true },
    bar: { isAlpha: true },
  });

  expect(chains).toHaveLength(2);
  expect(chainToContext(chains[0]).fields).toEqual(['foo']);
  expect(chainToContext(chains[1]).fields).toEqual(['bar']);
});

it('creates chain with an error message', () => {
  const chain = checkSchema({
    foo: {
      errorMessage: 'bar',
    },
  })[0];

  expect(chainToContext(chain).message).toBe('bar');
});

describe('locations', () => {
  it('includes by default all of them', () => {
    const chain = checkSchema({
      foo: {},
    })[0];

    expect(chainToContext(chain).locations).toEqual([
      'body',
      'cookies',
      'headers',
      'params',
      'query',
    ]);
  });

  it('includes all of the specified ones', () => {
    const chain = checkSchema(
      {
        foo: {},
      },
      ['headers', 'cookies'],
    )[0];

    expect(chainToContext(chain).locations).toEqual(['headers', 'cookies']);
  });

  it('includes location in "in" when string', () => {
    const chain = checkSchema({
      foo: {
        in: 'body',
      },
    })[0];

    expect(chainToContext(chain).locations).toEqual(['body']);
  });

  it('includes locations in "in" when array', () => {
    const chain = checkSchema({
      foo: {
        in: ['params', 'body'],
      },
    })[0];

    expect(chainToContext(chain).locations).toEqual(['params', 'body']);
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

    expect(chainToContext(chain).stack).toHaveLength(2);
  });

  it('adds with options', async () => {
    const schema = checkSchema({
      foo: {
        custom: {
          options: value => value > 0,
        },
      },
      bar: {
        whitelist: {
          options: ['a'],
        },
      },
    });

    const results = await Promise.all(
      schema.map(chain =>
        chain.run({
          query: { foo: 0, bar: 'baz' },
        }),
      ),
    );

    expect(results[0].context.errors).toHaveLength(1);
    expect(results[1].context.getData()).toContainEqual(
      expect.objectContaining({ path: 'bar', value: 'a', originalValue: 'baz' }),
    );
  });

  it('sets error message', () => {
    const chain = checkSchema({
      foo: {
        isInt: {
          errorMessage: 'bla',
        },
      },
    })[0];

    expect(chainToContext(chain).stack[0]).toHaveProperty('message', 'bla');
  });

  // #548
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

    const isInt = chainToContext(chain).stack[0];
    expect(isInt).toHaveProperty('message', 'from toInt');
  });

  it('can be marked as optional', () => {
    const schema = checkSchema({
      foo: {
        optional: true,
      },
      bar: {
        optional: {
          options: {
            checkFalsy: true,
            nullable: true,
          },
        },
      },
    });

    expect(chainToContext(schema[0]).optional).toEqual({
      checkFalsy: false,
      nullable: false,
    });

    expect(chainToContext(schema[1]).optional).toEqual({
      checkFalsy: true,
      nullable: true,
    });
  });

  it('can negate validators', async () => {
    const chain = checkSchema({
      foo: {
        isEmpty: {
          negated: true,
        },
      },
    })[0];

    const { context } = await chain.run({ params: { foo: '' } });
    expect(context.errors).toHaveLength(1);
  });
});

describe('on schema that contains fields with bail methods', () => {
  it('should stop validation chain with only one error', async () => {
    const schema = checkSchema({
      foo: {
        exists: {
          bail: true,
        },
        isLength: {
          options: {
            min: 5,
          },
        },
      },
    });

    const context = await schema[0].run({ params: {} });
    expect(context.errors).toHaveLength(1);
  });

  it('should not bail if valid value', async () => {
    const schema = checkSchema({
      foo: {
        exists: {
          bail: true,
        },
        isLength: {
          options: {
            max: 5,
          },
        },
      },
    });

    const context = await schema[0].run({ params: { foo: 'a' } });
    expect(context.errors).toHaveLength(0);
  });

  it('should bail with message', async () => {
    const schema = checkSchema({
      foo: {
        exists: {
          bail: true,
          errorMessage: 'Value not exists',
        },
        isLength: {
          options: {
            max: 5,
          },
        },
      },
    });

    const context = await schema[0].run({ params: {} });
    expect(context.errors).toHaveLength(1);
    expect(chainToContext(schema[0]).stack[0]).toHaveProperty('message', 'Value not exists');
  });

  it('should support multiple bail methods', async () => {
    const schema = checkSchema({
      foo: {
        exists: {
          bail: true,
        },
        isEmail: {
          bail: true,
        },
        isLength: {
          options: {
            min: 11,
          },
        },
      },
    });

    const context = await schema[0].run({ params: { foo: 'notAnEmail' } });
    expect(context.errors).toHaveLength(1);
  });
});
