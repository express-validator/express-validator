---
title: checkExact
toc_max_heading_level: 4
---

import { SideBySideExample, UsageExample, ErrorExample } from '@site/components/example';

# `checkExact()`

## `checkExact()` {#checkexact}

```ts
checkExact(
  chains?: ValidationChain | ValidationChain[] | (ValidationChain | ValidationChain[])[],
  options?: { locations?: Location[], message?: any }
): Middleware & ContextRunner
```

The `checkExact()` middleware checks whether the request contains exactly only fields that have a
[validation chain](./validation-chain.md) associated to them.

A field is considered known by `checkExact()` if there were validation chains specified for it
before `checkExact()` ran.

If one or more validation chains are passed as argument to `checkExact()`, then they will be run and
the fields targeted by them will be considered known, in addition to the validation chains previously
specified.

```ts
app.post(
  '/signup',
  // All of name, email and password are known fields in req.body. Everything else is unknown.
  body('name').notEmpty(),
  checkExact([body('email').isEmail(), body('password').isLength({ min: 8 })], {
    message: 'Too many fields specified',
  }),
  (req, res) => {
    // Handle request
  },
);
```

If any unknown fields are found in the request, a [`UnknownFieldsError` error](./validation-result.md#unknownfieldvalidationerror)
is added to the request using the default message of `Unknown field(s)`.
This message can be changed via `options.message`, which if is a function,
must be a [`UnknownFieldMessageFactory`](#unknownfieldmessagefactory).

:::caution

`checkExact()` **must** be the last validation middleware to run in your request,
otherwise it'll mark subsequent fields that have a validation chain as unknown ones.

In the following example, the `email` is a known field, but not `subscribe`.
Therefore, `checkExact` will generate an error when `subscribe` is specified in the request:

```ts
app.post(
  '/newsletter/subscription',
  body('email').isEmail(),
  checkExact(),
  body('subscribe').isBoolean(),
  (req, res) => {
    // Handle request
  },
);
```

:::

### The `locations` option {#locations-option}

The locations at which the `checkExact()` checks for unknown fields can be customized by setting
`options.locations`.  
By default, it includes only `body`, `params` and `query`.

This is a sensible default to make sure that a user's valid requests don't fail because of aspects
that might be too hard to fix up:

1. The HTTP specification lists a wide number of headers for varied use cases and reasons.  
   You shouldn't need to specify all of them in order to avoid false negatives from `checkExact()`;
2. Browsers and proxies are always introducing new headers, which makes the list of headers that need
   to be known for `checkExact()` to work properly infinitely larger;
3. By default, browsers automatically pick up and send cookies along with every request.  
   JavaScript ads or analytics scripts usually create cookies on the hosting website, which makes
   using `checkExact()` with cookies much more annoying.

For these reasons, `req.cookies` and `req.headers` aren't checked for unknown fields _by default_,
though you can include them by setting `options.locations`.

Unknown fields outside of `options.locations` aren't reported.

### Examples

#### Without input validation chains {#example-without-chains}

In this example, `checkExact()` will see that `email` and `password` have validation chains,
and won't mark them as unknown fields.

Any other field present in `req.body`, `req.query` or `req.params` will cause an
[`UnknownFieldValidationError`](./validation-result.md#unknownfieldvalidationerror).

```ts
app.post(
  '/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  checkExact([], { message: 'Only email and password are allowed' }),
  (req, res) => {
    // Handle request
  },
);
```

#### With `checkSchema()` {#example-schema}

[`checkSchema()`](./check-schema.md) returns a list of validation chains, which means it can be passed
straight to `checkExact()`:

```ts
app.post(
  '/signup',
  checkExact(
    checkSchema({
      email: { isEmail: true },
      password: { isLength: { options: { min: 8 } } },
    }),
  ),
  (req, res) => {
    // Handle request
  },
);
```

#### With the `locations` option {#example-locations}

Say you wish to check only `req.body` for unknown fields. Every other request location is OK to
contain unknown fields. You can do this with [the `locations` option](#locations-option):

```ts
app.post(
  '/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  checkExact([], { locations: ['body'] }),
  (req, res) => {
    // Handle request
  },
);
```

#### Manually running `checkExact()` {#example-manual}

`checkExact()` returns a middleware, which makes it ideal to pass to an express.js route.
But since its return is also a [`ContextRunner`](./context-runner.md), you can also run it manually,
if you wish.

```ts
app.post(
  '/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    const result = await checkExact().run(req);
    if (result.isEmpty()) {
      console.log('No unknown fields in the request');
    }
  },
);
```

## `UnknownFieldMessageFactory`

```ts
type UnknownFieldMessageFactory = (
  unknownFields: UnknownFieldInstance[],
  opts: { req: Request },
) => any;
```

The message factory type used when the `checkExact()` `message` option is a function.

```ts
checkExact([body('name').notEmpty(), body('email').isEmail()], {
  message: fields => {
    const [field] = fields;
    return `Unknown field ${field.path} in ${field.location} with value ${field.value}`;
  },
});
```
