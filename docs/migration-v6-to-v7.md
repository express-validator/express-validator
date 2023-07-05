---
title: Migration from v6 to v7
---

The migration process from express-validator v6.x.x to v7.x.x is manual.
You'll need to follow these steps after you've upgraded the package on your project.

## Support

Node 12 is no longer supported. You'll need to upgrade to Node 14 or newer.

## Removed deprecated APIs

### Import paths

Importing from `express-validator/check` and `express-validator/filter` had been deprecated since v6.0.0.
They are now gone from the package, and you should always import from `express-validator`.

### Sanitization-only APIs

All `sanitize` functions have been removed, as `check` functions offer exactly the same functionality,
and more.

You can replace the following snippets on your codebase:

| From                    | To              |
| ----------------------- | --------------- |
| `sanitize(field)`       | `check(field)`  |
| `sanitizeBody(field)`   | `body(field)`   |
| `sanitizeCookie(field)` | `cookie(field)` |
| `sanitizeHeader(field)` | `header(field)` |
| `sanitizeParam(field)`  | `param(field)`  |
| `sanitizeQuery(field)`  | `query(field)`  |

### TypeScript types

The following types have been removed from express-validator and can be transparently replaced:

| From                    | To            |
| ----------------------- | ------------- |
| `ValidationParamSchema` | `ParamSchema` |
| `ValidationSchema`       | `Schema`      |

## Validators

### `isObject()`

The `strict` option, when unset, would default to `false`, meaning that arrays and `null` values would
pass validation. The new default value is `true`.

To maintain v6.x.x behavior, the following change is necessary:

```diff
- check('object').isObject()
+ check('object').isObject({ strict: false })
```

## Validation errors

Validation errors used to be objects in the format `{ param, msg, value, location, nestedErrors }`,
where `nestedErrors` is only present in errors caused by `oneOf()`, which would also always have the
`path: '_error'`.

Given that there are now a couple more [error types](./api/validation-result.md#error-types),
a couple of changes were necessary:

### Renamed properties

The `param` property has been renamed to `path`, to reduce chance of confusion with the `req.params`
location.

```diff
const errors = validationResult(req).array();
- console.log(`Error on the field ${errors[0].param}`);
+ console.log(`Error on the field ${errors[0].path}`);
```

### Telling error types apart

The `ValidationError` type in TypeScript is now a
[discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions).

It might be necessary to use a `switch` or `if` statements to check that you're dealing with the
type that you want to format/debug. For example:

```ts
const result = validationResult(req).formatWith(error => {
  switch (error.type) {
    case 'field':
      // this is a FieldValidationError
      return `Error on field ${error.path}`;

    case 'alternative':
    case 'grouped_alternative':
      // this is an AlternativeValidationError or GroupedAlternativeValidationError
      console.log(error.nestedErrors);
      return error.msg;

    case 'unknown_fields':
      // this is an UnknownFieldValidationError
      const fields = error.fields.map(field => field.path).join(', ');
      return `Unknown fields found, please remove them: ${fields}`;

    default:
      // Not a known type.
      throw new Error(`Not a known express-validator error: ${error.type}`);
  }
});
```

:::note

For the up-to-date documentation, see the [`ValidationError` type](./api/validation-result.md#validationerror).

:::

## `oneOf()`

### Signature {#oneof-signature}

The signature of `oneOf()` has changed. Its second argument used to be the message to use,
but now it's an object of options.

```diff
oneOf(
  [check('email').isEmail(), check('phone').isMobilePhone()],
- 'At least one contact method must be provided',
+ { message: 'At least one contact method must be provided' }
)
```

Furthermore, if `message` is a function, its signature has also changed to include the list of
nested errors:

```diff
oneOf(
  [check('email').isEmail(), check('phone').isMobilePhone()],
- (req) => {
+ {
+   message: (nestedErrors, req) => {
+     console.log(nestedErrors);
      return req.translate('one_of_error'),
  }
)
```

### Error type {#oneof-error-type}

`oneOf()` used to be a bit inflexible with how it returned nested errors, which is why it now takes
an `errorType` option that allows extra customizations.

To maintain behavior from v6.x.x, make the following change:

```diff
oneOf(
  [check('email').isEmail(), check('phone').isMobilePhone()],
+ { errorType: 'flat' }
)
```

:::tip

Learn more on the [error types documentation](./api/one-of.md#error-types).

:::

## Other breaking changes

Please check [express-validator v7.0.0 release notes](https://github.com/express-validator/express-validator/releases/tag/v7.0.0)
to learn about other breaking changes.
