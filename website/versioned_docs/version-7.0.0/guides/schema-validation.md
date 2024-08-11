---
title: Schema validation
---

## What are schemas?

Schemas are an object-based way of defining validations or sanitizations on requests.
They offer exactly the same functionality as regular validation chains - in fact, under the hood,
express-validator deals all in validation chains!

If you don't like the idea of specifying your validations using JavaScript functions, and instead
prefer an even more declarative approach, then schema validations might be the right express-validator
tool for you.

## Specifying a schema

Schemas are plain JavaScript objects that you pass to the [`checkSchema()` function](../api/check-schema.md),
where you specify which fields to validate as the keys, and the schema of the field as the value.

In turn, the field schemas contain the validators, sanitizers, and any options to modify the behavior
of the internal validation chain.

A basic example looks like this:

```ts
checkSchema({
  username: {
    errorMessage: 'Invalid username',
    isEmail: true,
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password should be at least 8 chars',
    },
  },
});
```

:::info

Check out the [full documentation](../api/check-schema.md#schema) to learn about all of the options.

:::

### Using wildcards and globstars

The [advanced field selection features](./field-selection.md#advanced-features) are also available
when using schemas.

It should be noted that in JavaScript it's not possible to directly use the `*` character as an
object key though, so it must be wrapped in quotes for it to work:

```ts
checkSchema({
  'addresses.*.street': {
    notEmpty: true,
  },
  'addresses.*.number': {
    isInt: true,
  },
});
```
