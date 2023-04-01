---
title: checkSchema
toc_max_heading_level: 4
---

import { SideBySideExample, ExampleCell } from '@site/components/example';

# `checkSchema()`

## `checkSchema()`

```ts
checkSchema(schema: Schema, defaultLocations?: Location[]): ValidationChain[]
```

Creates a list of [validation chains](./validation-chain.md) based on the provided [`schema`](#schema),
which can then be passed to an express.js route for validation.

```ts
app.post(
  '/signup',
  checkSchema({
    email: { isEmail: true },
    pasword: { isLength: { options: { min: 8 } } },
  }),
  (req, res) => {
    // Handle request
  },
);
```

By default, all specified fields are validated in all request locations (all of `body`, `cookies`, `headers`, `params` and `query`).  
This list can be changed by specifying the `defaultLocations` parameter. For example, to validate fields by default in `body` and `query`:

```ts
checkSchema(schema, ['body', 'query']);
```

You can also fine tune the locations checked for each field by setting the [`in` property](#in), which takes precedence over the `defaultLocations` parameter.

## `Schema`

The schema is a simple object from [field paths](../guides/field-selection.md) to field schemas. The field paths define which fields get selected for validation, and the schema defines how those fields get validated.

A field schema is an object whose keys can be a mix of one or more of

- [built-in validators](#built-in-validators)
- [built-in sanitizers](#built-in-sanitizers)
- [field modifiers](#field-schema-modifiers)
- or any other name, meaning it's either a [custom validator or custom sanitizer](#custom-validators)

If the object keys are none of the above, then it has to be a [custom schema](#custom-schema).

### Built-in Validators

Any of the [built-in validators](./validation-chain.md#built-in-validators) can be used in a field schema.

If the built-in validator is set to `true`, then it's turned on without any options:

<SideBySideExample>
<ExampleCell title="checkSchema() usage">

```ts
checkSchema({
  email: { isEmail: true },
  password: { notEmpty: true },
});
```

</ExampleCell>
<ExampleCell title="Validation chain equivalent">

```ts
check('email').isEmail();
check('password').notEmpty();
```

</ExampleCell>
</SideBySideExample>

The value may also be an object, in which case the validator is turned on with additional configurations:

#### `options` {#validator-options}

Sets the options of the validator. If there are multiple options, then `options` must be an array.
Otherwise, you can pass the value directly.

<SideBySideExample>
<ExampleCell title="checkSchema() usage">

```ts
checkSchema({
  phone: {
    isMobilePhone: {
      options: ['any', { strictMode: true }],
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
    },
  },
});
```

</ExampleCell>
<ExampleCell title="Validation chain equivalent">

```ts
check('phone').isMobilePhone('any', {
  strictMode: true,
});
check('password').isLength({ min: 8 });
```

</ExampleCell>
</SideBySideExample>

:::note

If the only option to be passed to the validator is an array, then it must be wrapped in another array.
This is usually the case of `isIn`; for example:

```ts
checkSchema({
  weekend: {
    // 👎 Translates to `isIn('saturday', 'sunday')`
    isIn: { options: ['saturday', 'sunday'] },
    // 👍 Translates to `isIn(['saturday', 'sunday'])`
    isIn: { options: [['saturday', 'sunday']] },
  },
});
```

:::

#### `bail`

Stop running the validation chain if the current validator (or any of the previous validators) failed.
Equivalent to using [`.bail()` on a validation chain](./validation-chain.md#bail).

<SideBySideExample>
<ExampleCell title="checkSchema() usage">

```ts
checkSchema({
  email: {
    // isEmail is run first. If the email isn't valid, then the
    // custom validator `checkEmailNotInUse` won't run
    isEmail: { bail: true },
    custom: { options: checkEmailNotInUse },
  },
});
```

</ExampleCell>
<ExampleCell title="Validation chain equivalent">

```ts
check('email').isEmail().bail().custom(checkEmailNotInUse);
```

</ExampleCell>
</SideBySideExample>

#### `if`

Adds a condition on whether the field's validators should continue running.
Equivalent to using [`.if()` on a validation chain](./validation-chain.md#if).

`if` is applied _before_ the current validator. This means that if its condition isn't met,
then that validator and following validators won't run.

```ts
checkSchema({
  newPassword: {
    exists: {
      // With a custom validator
      if: (value, { req }) => !!req.body.oldPassword,

      // With a validation chain
      if: body('oldPassword').notEmpty(),
    },
  },
});
```

#### `negated`

Negates the validator. Equivalent to using [`.not()` on a validation chain](./validation-chain.md#not).

```ts
checkSchema({
  password: {
    // Check if password is not empty
    isEmpty: { negated: true },
  },
});
```

#### `errorMessage` {#validator-errormessage}

Sets the error message for a validator.
Equivalent to using [`.withMessage()` on a validation chain](./validation-chain.md#withmessage).

<SideBySideExample>
<ExampleCell title="checkSchema() usage">

```ts
checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Must be a valid e-mail address',
    },
  },
});
```

</ExampleCell>
<ExampleCell title="Validation chain equivalent">

```ts
check('email').isEmail().withMessage('Must be a valid e-mail address');
```

</ExampleCell>
</SideBySideExample>

### Built-in Sanitizers

Any of the [built-in sanitizers](./validation-chain.md#built-in-sanitizers) can be used in a field schema.

If the built-in sanitizer is set to `true`, then it's turned on without any options:

<SideBySideExample>
<ExampleCell title="checkSchema() usage">

```ts
checkSchema({
  query: { trim: true },
});
```

</ExampleCell>
<ExampleCell title="Validation chain equivalent">

```ts
check('query').trim();
```

</ExampleCell>
</SideBySideExample>

The value may also be an object, in which case the sanitizer is turned on with additional configurations:

#### `options` {#sanitizer-options}

Sets the options of the sanitizer. If there are multiple options, then `options` must be an array.
Otherwise, you can pass the value directly.

<SideBySideExample>
<ExampleCell title="checkSchema() usage">

```ts
checkSchema({
  email: {
    normalizeEmail: {
      options: { gmail_remove_subaddress: true },
    },
  },
});
```

</ExampleCell>
<ExampleCell title="Validation chain equivalent">

```ts
check('email').normalizeEmail({
  gmail_remove_subaddress: true,
});
```

</ExampleCell>
</SideBySideExample>

### Field schema modifiers

The following properties can be specified in the schema of a field to modify its general behavior:

#### `in`

Defines the location(s) in which to validate the field.
To validate that a field exists in either the body or in the query string, the following schema can be written:

```ts
checkSchema({
  field: {
    in: ['body', 'query'],
    exists: true,
  },
});
```

#### `errorMessage` {#field-errormessage}

Sets the default error message for the field's validators.  
Used when a validator doesn't specify [`errorMessage` in its own configurations](#validator-errormessage).

<SideBySideExample>
<ExampleCell title="checkSchema() usage">

```ts
checkSchema({
  password: {
    errorMessage: 'The password must be at least 8 characters, and must contain a symbol',
    isLength: { options: { min: 8 } },
    matches: { options: /[-_$#]/ },
  },
});
```

</ExampleCell>
<ExampleCell title="Validation chain equivalent">

```ts
check('password', 'The password must be at least 8 characters, and must contain a symbol')
  .isLength({ min: 8 })
  .matches(/[-_$#]/);
```

</ExampleCell>
</SideBySideExample>

#### `optional`

Sets the optional modifier on the field. Equivalent to using [`.optional()` on a validation chain](./validation-chain.md#optional).

<SideBySideExample>
<ExampleCell title="checkSchema() usage">

```ts
checkSchema({
  query: {
    optional: true,
    isLength: { options: { min: 3 } },
  },
});
```

</ExampleCell>
<ExampleCell title="Validation chain equivalent">

```ts
check('query').optional().isLength({ min: 3 });
```

</ExampleCell>
</SideBySideExample>

### Custom validators/sanitizers {#custom-validators}

There are two ways of defining custom validators or sanitizers using `checkSchema()`.

The first way is to set `custom` or `customSanitizer` in a field's schema.
These work exactly like any other [validator](#built-in-validators) or [sanitizer](#built-in-sanitizers) in the schema:

<SideBySideExample>
<ExampleCell title="checkSchema() usage">

```ts
checkSchema({
  email: {
    custom: {
      options: checkIfEmailExists,
      bail: true,
    },
    customSanitizer: {
      options: removeEmailAttribute,
    },
  },
});
```

</ExampleCell>
<ExampleCell title="Validation chain equivalent">

```ts
check('email').custom(checkIfEmailExists).bail().customSanitizer(removeEmailAttribute);
```

</ExampleCell>
</SideBySideExample>

While this works fine, it's only possible to set a single custom validator/sanitizer when using schemas.
The reason for this is simple:
**objects in JavaScript cannot have duplicated keys** (well, they can, but only the last one will apply).

For this reason, it's possible to use multiple custom validators/sanitizers in `checkSchema()` by
setting in the field schema a key which isn't any of the [built-in validators](#built-in-validators),
[sanitizers](#built-in-sanitizers) or [modifiers](#field-schema-modifiers).  
These keys must be an object with a single `custom` or `customSanitizer` function.

The previous example can be rewritten like this:

```ts
checkSchema({
  email: {
    emailNotInUse: {
      custom: checkEmailNotInUse,
      bail: true,
    },
    removeEmailAttribute: {
      customSanitizer: removeEmailAttribute,
    },
  },
});
```

:::info

The name of the custom validator/sanitizer is not used by `checkSchema()`.
Different schemas can make use of the same custom name without clash.

:::
