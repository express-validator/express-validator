---
title: ValidationChain
toc_max_heading_level: 4
---

import ValidatorValidators from './validator/\_validators.md';
import ValidatorSanitizers from './validator/\_sanitizers.md';

# `ValidationChain`

The validation chain contains all of the built-in validators, sanitizers and utility methods to fine
tune the behaviour of the validation for a certain field or fields.

Validation chains are created by the [`check()` functions](./check.md), and they can be used in a few ways:

- as express.js route handlers, which will run the validation automatically;
- as parameter of some of express-validator's other functions, like `oneOf()` or `checkExact()`;
- [standalone, where you have full control over when the validation runs and how](../guides/manually-running.md).

:::tip

If you're writing a function that accepts a `ValidationChain`, the TypeScript type can be imported using

```ts
import { ValidationChain } from 'express-validator';
```

:::

## Built-in validators

### `.custom()`

```ts
custom(validator: (value, { req, location, path }) => any): ValidationChain
```

Adds a custom validator function to the chain.

The field value will be valid if:

- The custom validator returns truthy; or
- The custom validator returns a promise that resolves.

If the custom validator returns falsy, a promise that rejects, or if the function throws,
then the value will be considered invalid.

A common use case for `.custom()` is to verify that an e-mail address doesn't already exists.
If it does, return an error:

```ts
app.post('/signup', body('email').custom(async value => {
  const existingUser = await Users.findUserByEmail(value);
  if (existingUser) {
    throw new Error('E-mail already in use');
  }
}), (req, res) => {
  // Handle request
});
```

### `.exists()`

```ts
exists(options?: {
  values?: 'undefined' | 'null' | 'falsy',
  checkNull?: boolean,
  checkFalsy?: boolean
}): ValidationChain
```

Adds a validator to check if the field exists.

Which values are considered existent depends on `options.values`. By default, it's set to `undefined`:

| `options.values` | Behavior                                                                             |
| ---------------- | ------------------------------------------------------------------------------------ |
| `undefined`      | `undefined` values don't exist                                                       |
| `null`           | `undefined` and `null` values don't exist                                            |
| `falsy`          | Falsy values (empty strings, `0`, `false`, `null` and `undefined` values don't exist |

`options.checkNull` and `options.checkFalsy` are deprecated options.
They are aliases to setting `options.values` to `null` and `falsy`, respectively.

:::note

Using `.exists()` is only necessary if you aren't adding any other validator or sanitizer.

:::

### `.isArray()`

```ts
isArray(options?: { min?: number; max?: number }): ValidationChain
```

Adds a validator to check that a value is an array.
This is analogous to [the JavaScript function `Array.isArray(value)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).

You can also check that the array's length is greater than or equal to `options.min` and/or
that it's less than or equal to `options.max`.

```ts
// Verifies that the friends list is an array
body('friends').isArray();

// Verifies that ingredients is an array with length >= 0
body('ingredients').isArray({ min: 0 });

// Verifies that team_members is an array with length >= 0 and <= 10
check('team_members').isArray({ min: 0, max: 10 });
```

### `.isObject()`

```ts
isObject(options?: { strict?: boolean }): ValidationChain
```

Adds a validator to check that a value is an object.
For example, `{}`, `{ foo: 'bar' }` and `new MyCustomClass()` would all pass this validator.

If the `strict` option is set to `false`, then this validator works analogous to
[`typeof value === 'object'` in pure JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof),
where both arrays and the `null` value are considered objects.

### `.isString()`

```ts
isString(): ValidationChain
```

Adds a validator to check that a value is a string.
This is analogous to a [`typeof value === 'string'` in pure JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof).

### `.notEmpty()`

```ts
notEmpty(): ValidationChain
```

Adds a validator to check that a value is a string that's not empty.
This is analogous to `.not().isEmpty()`.

### Standard validators

:::info

Please check the documentation on standard validators [here](../guides/validation-chain.md#standard-validatorssanitizers).

:::

<ValidatorValidators/>

## Built-in sanitizers

### `.customSanitizer()`

```ts
customSanitizer(sanitizer: (value, { req, location, path }) => any): ValidationChain
```

Adds a custom sanitizer function to the chain.
The value returned by the function will become the new value of the field.

```ts
app.post('/object/:id', param('id').customSanitizer((value, { req }) => {
  // In this app, users have MongoDB style object IDs, everything else, numbers
  return req.query.type === 'user' ? ObjectId(value) : Number(value);
})), (req, res) => {
  // Handle request
});
```

### `.default()`

```ts
default(defaultValue: any): ValidationChain
```

Replaces the value of the field if it's either an empty string, `null`, `undefined`, or `NaN`.

```ts
app.post('/', body('username').default('foo'), (req, res, next) => {
  // 'bar'     => 'bar'
  // ''        => 'foo'
  // undefined => 'foo'
  // null      => 'foo'
  // NaN       => 'foo'
});
```

### `.replace()`

```ts
replace(valuesFrom: any[], valueTo: any): ValidationChain
```

Replaces the value of the field with `valueTo` whenever the current value is in `valuesFrom`.

```ts
app.post('/', body('username').replace(['bar', 'BAR'], 'foo'), (req, res, next) => {
  // 'bar_' => 'bar_'
  // 'bar'  => 'foo'
  // 'BAR'  => 'foo'
  console.log(req.body.username);
});
```

### `.toArray()`

```ts
toArray(): ValidationChain
```

Transforms the value to an array. If it already is one, nothing is done. `undefined` values become empty arrays.

### `.toLowerCase()`

```ts
toLowerCase(): ValidationChain
```

Converts the value to lower case. If not a string, does nothing.

### `.toUpperCase()`

```ts
toUpperCase(): ValidationChain
```

Converts the value to upper case. If not a string, does nothing.

### Standard sanitizers

:::info

Please check the documentation on standard sanitizers [here](../guides/validation-chain.md#standard-validatorssanitizers).

:::

<ValidatorSanitizers/>

## Modifiers

### `.bail()`

```ts
bail(options?: { level: 'chain' | 'request' }): ValidationChain
```

**Parameters:**

| Name            | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `options.level` | The level at which the validation chain should be stopped. Defaults to `chain`. |

Stops running the validation chain if any of the previous validators failed.

This is useful to prevent a custom validator that touches a database or external API from running
when you know it will fail.

`.bail()` can be used multiple times in the same validation chain if desired:

```js
body('username')
  .isEmail()
  // If not an email, stop here
  .bail()
  .custom(checkDenylistDomain)
  // If domain is not allowed, don't go check if it already exists
  .bail()
  .custom(checkEmailExists);
```

If the `level` option is set to `request`, then also no further validation chains will run on the current request.
For example:

```ts
app.get(
  '/search',
  query('query').notEmpty().bail({ level: 'request' }),
  // If `query` is empty, then the following validation chains won't run:
  query('query_type').isIn(['user', 'posts']),
  query('num_results').isInt(),
  (req, res) => {
    // Handle request
  },
);
```

:::caution

Functions such as [`oneOf()`](./one-of.md) and [`checkExact()`](./check-exact.md) can become slower
when using request-level bail, since validation chains that would normally run in parallel need to
run in sequence.

:::

### `.if()`

```ts
if(condition: CustomValidator | ContextRunner): ValidationChain
```

Adds a condition on whether the validation chain should continue running on a field or not.

The condition may be either a [custom validator](#custom) or a [`ContextRunner` instance](./misc.md#contextrunner).

```js
body('newPassword')
  // Only validate if the old password has been provided
  .if((value, { req }) => req.body.oldPassword)
  // Or, use a validation chain instead
  .if(body('oldPassword').notEmpty())
  // The length of the new password will only be checked if `oldPassword` is provided.
  .isLength({ min: 6 });
```

### `.not()`

```ts
not(): ValidationChain
```

Negates the result of the next validator in the chain.

```ts
check('weekday').not().isIn(['sunday', 'saturday']);
```

### `.optional()`

```ts
optional(options?: boolean | {
  values?: 'undefined' | 'null' | 'falsy',
  nullable?: boolean,
  checkFalsy?: boolean,
}): ValidationChain
```

Marks the current validation chain as optional.
An optional field skips validation depending on its value, instead of failing it.

Which values are considered optional depends on `options.values`.
By default, it's set to `undefined`:

| `options.values` | Behavior                                                                              |
| ---------------- | ------------------------------------------------------------------------------------- |
| `undefined`      | `undefined` values are optional                                                       |
| `null`           | `undefined` and `null` values are optional                                            |
| `falsy`          | Falsy values (empty strings, `0`, `false`, `null` and `undefined` values are optional |

`options.nullable` and `options.checkFalsy` are deprecated options.
They are aliases to setting `options.values` to `null` or `falsy`.

If `options` is `false`, then the field won't be optional.

:::info

Unlike validators and sanitizers, `.optional()` is not positional: it'll affect how values are interpreted,
no matter where it happens in the chain.

For example, there are no differences between this:

```ts
body('json_string').isLength({ max: 100 }).isJSON().optional().
```

and this:

```ts
body('json_string').optional().isLength({ max: 100 }).isJSON().
```

:::

### `.withMessage()`

```ts
withMessage(message: any): ValidationChain
```

Sets the error message used by the previous validator.
