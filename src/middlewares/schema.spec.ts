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

  it('halts chain execution if "if" statement resolves to false', async () => {
    const schema = checkSchema({
      foo: {
        isEmpty: {
          if: (value: any) => {
            return value !== '';
          },
        },
      },
    });

    const { context } = await schema[0].run({ query: { foo: '' } });

    expect(context.errors).toHaveLength(0);
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

  it('use default config when specified', async () => {
    const chain = checkSchema({
      undef: {
        default: {
          options: 10,
        },
      },
    })[0];

    const req = { query: { undef: undefined }, body: {}, params: {}, headers: {}, cookies: {} };
    const { context } = await chain.run(req);

    expect(context.getData().every(instance => instance.value === 10)).toBe(true);
    expect(req.query.undef).toBe(10);
    expect((req as any).body.undef).toBe(10);
    expect((req as any).headers.undef).toBe(10);
    expect((req as any).params.undef).toBe(10);
    expect((req as any).cookies.undef).toBe(10);
  });
});

describe('when ParamSchema location not specified', () => {
  it('should validate locations only in which the field can be found', async () => {
    const schema = checkSchema({
      foo: {
        isInt: true,
        toInt: true,
      },
    });
    const { context } = await schema[0].run({
      query: { foo: 'foo' },
      params: { foo: 'true' },
    });

    expect(context.errors).toHaveLength(2);
  });
});
describe('on schema that contains fields with bail methods', () => {
  it('stops validation chain with only one error with specified location', async () => {
    const schema = checkSchema({
      foo: {
        in: ['params'],
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

    const { context } = await schema[0].run({ query: {} });
    expect(context.errors).toHaveLength(1);
  });

  it('stops validation chain if any validation fails with "exist" validator', async () => {
    const allLocations = ['body', 'cookies', 'headers', 'params', 'query'];
    const schema = checkSchema({
      foo: {
        exists: {
          bail: true,
          errorMessage: 'exists checking failed',
        },
        isLength: {
          options: {
            min: 5,
          },
        },
      },
    });

    const { context } = await schema[0].run({ query: {} });
    // when location is not specified, checking each location one by one,
    // if the expected field does not show up at all in any location, then there will be 5 errors.
    // finally bails.
    expect(context.errors).toHaveLength(allLocations.length);
    // context.errors should not contain any error from next validator -> isLength.
    expect(context.errors.every(err => err.msg === 'exists checking failed')).toBe(true);
  });

  it('stops validation chain if any validation fails with sanitizer', async () => {
    const schema = checkSchema({
      foo: {
        toInt: true,
        isInt: {
          bail: true,
        },
        isLength: {
          options: {
            min: 5,
          },
        },
      },
    });

    const { context } = await schema[0].run({ query: { foo: 'true' } });
    const {
      errors: [firstError],
    } = context;

    // simply make sure it's sanitizer-result-caused error.
    expect(firstError.value).toBe(NaN);
    expect(context.errors).toHaveLength(1);
  });

  it('does not bail if value is valid', async () => {
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

    const { context } = await schema[0].run({ params: { foo: 'a' } });
    expect(context.errors).toHaveLength(0);
  });

  it('bails with message', async () => {
    const schema = checkSchema({
      foo: {
        in: ['params'],
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

    const { context } = await schema[0].run({ params: {} });
    expect(context.errors).toHaveLength(1);
    expect(chainToContext(schema[0]).stack[0]).toHaveProperty('message', 'Value not exists');
  });

  it('support multiple bail methods', async () => {
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

    const { context } = await schema[0].run({ params: { foo: 'notAnEmail' } });
    expect(context.errors).toHaveLength(1);
  });
});

it('run checkSchema imperatively', async () => {
  const req = {
    body: { foo: 'foo' },
  };
  const schema = checkSchema({
    foo: {
      exists: true,
      isString: true,
    },
  });

  return expect(schema.run(req)).resolves;
});

it('correctly pass falsy values to `options` property of methods', async () => {
  const req = {
    body: { foo: undefined },
  };
  const schema = checkSchema({
    foo: {
      in: ['body'],
      default: { options: 0 },
    },
  });
  await schema.run(req);
  expect(req.body.foo).toEqual(0);
});
