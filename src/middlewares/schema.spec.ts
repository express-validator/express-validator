import { checkSchema } from './schema';

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

    expect(chain.context.locations).toEqual(['body', 'cookies', 'headers', 'params', 'query']);
  });

  it('includes all of the specified ones', () => {
    const chain = checkSchema(
      {
        foo: {},
      },
      ['headers', 'cookies'],
    )[0];

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

    expect(chain.context.stack).toHaveLength(2);
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

    await Promise.all(
      schema.map(chain =>
        chain.run({
          query: { foo: 0, bar: 'baz' },
        }),
      ),
    );

    expect(schema[0].context.errors).toHaveLength(1);
    expect(schema[1].context.getData()).toContainEqual(
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

    expect(chain.context.stack[0]).toHaveProperty('message', 'bla');
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

    const isInt = chain.context.stack[0];
    expect(isInt).toHaveProperty('message', 'from toInt');
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

  it('can negate validators', async () => {
    const chain = checkSchema({
      foo: {
        isEmpty: {
          negated: true,
        },
      },
    })[0];

    await chain.run({ params: { foo: '' } });
    expect(chain.context.errors).toHaveLength(1);
  });
});
