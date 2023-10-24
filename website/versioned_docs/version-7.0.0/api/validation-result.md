---
title: Errors and Validation Results
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page contains information about how you can determine if a request has been valid.
It also documents all possible validation error types.

## `validationResult()`

```ts
validationResult(req: Request): Result<ValidationError>
```

Extracts the validation results from a request, wraps them in a [`Result` object](#result),
and returns it.

<Tabs groupId="lang">
<TabItem value="js" label="JavaScript">

```js
const { query, validationResult } = require('express-validator');

app.post('/hello', query('person').notEmpty(), (req, res) => {
  const result = validationResult(req);
  // Use `result` to figure out if the request is valid or not
});
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```ts
import { query, Result, validationResult } from 'express-validator';

app.post('/hello', query('person').notEmpty(), (req, res) => {
  const result: Result = validationResult(req);
  // Use `result` to figure out if the request is valid or not
});
```

</TabItem>
</Tabs>

### `withDefaults()`

```ts
validationResult.withDefaults<T>(options: { formatter?: ErrorFormatter<T> }): ResultFactory<T>
```

Creates a new `validationResult()`-like function that uses the provided options as the defaults in
the returned `Result` object.

For example, it's possible to set the default [error formatter](#errorformatter) of a result like this:

<Tabs groupId="lang">
<TabItem value="js" label="JavaScript">

```js
const { query, validationResult } = require('express-validator');
const myValidationResult = validationResult.withDefaults({
  formatter: error => error.msg,
});

app.post('/hello', query('person').notEmpty(), (req, res) => {
  const errors = myValidationResult(req).array();
  // => ['Invalid value']
});
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```ts
import { query, ResultFactory, validationResult } from 'express-validator';
const myValidationResult: ResultFactory<string> = validationResult.withDefaults({
  formatter: error => error.msg as string,
});

app.post('/hello', query('person').notEmpty(), (req, res) => {
  const errors: string[] = myValidationResult(req).array();
  // => ['Invalid value']
});
```

</TabItem>
</Tabs>

## `ResultFactory<T>` {#resultfactory}

## `Result<T>` {#result}

The result object is a wrapper around the validation state of a request.
It provides a couple of methods that you can use to determine if the request is valid or not.

:::info

The type parameter `T` refers to the type that errors as returned by methods such as
[`.array()`](#array) and [`.mapped()`](#mapped) will have.

Its default is [`ValidationError`](#validationerror), which can be changed by using [`.formatWith()`](#formatwith).

:::

### `.isEmpty()`

```ts
isEmpty(): boolean
```

Returns whether the request contains validation errors, and therefore whether it's valid or not.

### `.formatWith()`

```ts
formatWith<T>(formatter: ErrorFormatter<T>): Result<T>
```

Rewraps the validation state in a new `Result` object that uses `formatter` as its [error formatter](#errorformatter).

<details>
<summary>💭 Why does this method return a new Result?
</summary>

If you've read through other pages of this documentation, you might be asking yourself why can't
`.formatWith()` mutate itself, like validation chains do?

The reason for this is simple: TypeScript.<br/>
It's not possible to change the generic type of an existing object. If some code references the
result as `Result<{ error: string }>`, but after `formatWith` it's now actually `Result<{ message: string }>`,
some code consuming the old `Result` type would not get compile-time errors about the type mismatch.

</details>

<Tabs groupId="lang">
<TabItem value="js" label="JavaScript">

```js
const { query, validationResult } = require('express-validator');

app.post('/hello', query('person').notEmpty(), (req, res) => {
  const result = validationResult(req);
  const errors = result.array();
  // => [{ msg: 'Invalid value', ... }]

  const result2 = result.formatWith(error => error.msg);
  const errors2 = result2.array();
  // => ['Invalid value']
});
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```ts
import { query, Result, validationResult } from 'express-validator';

app.post('/hello', query('person').notEmpty(), (req, res) => {
  const result: Result = validationResult(req);
  const errors = result.array();
  // => [{ msg: 'Invalid value', ... }]

  const result2: Result<string> = result.formatWith(error => error.msg as string);
  const errors2 = result2.array();
  // => ['Invalid value']
});
```

</TabItem>
</Tabs>

### `.array()`

```ts
array(options?: { onlyFirstError?: boolean }): T[]
```

Returns a list of all errors from all validated fields.

```ts
const result = validationResult(req).array();
// => [{ msg: 'Invalid value', path: 'field1' }, { msg: 'Invalid value', path: 'field1' }]
```

When `options.onlyFirstError` is set to `true`, then only the first error of each field is returned:

```ts
const result = validationResult(req).array({ onlyFirstError: true });
// => [{ msg: 'Invalid value', path: 'field1' }]
```

### `.mapped()`

```ts
mapped(): Record<string, T>
```

Returns an object from field path to error.
If a field has multiple errors, only the first one is returned.

```ts
const result = validationResult(req).mapped();
// => { field1: { msg: 'Invalid value', ... }, field2: { msg: 'Invalid value', ... } }
```

### `.throw()`

```ts
throw(): void
```

If the result object has errors, then this method throws an error decorated with the same methods as
the `Result` type.<br/>
This is useful if you wish to forward the errors to the error handler middleware of your express.js
application, for example.

If the result object has no errors, then this method does nothing.

```ts
app.post('/hello', query('person').notEmpty(), (req, res) => {
  try {
    validationResult(req).throw();
    res.send(`Hello, ${req.query.person}!`);
  } catch (e) {
    res.status(400).send({ errors: e.mapped() });
  }
});
```

## Error types

Different APIs in express-validator cause different types of validation errors.
All of them are documented here:

### `FieldValidationError`

```ts
type FieldValidationError = {
  type: 'field';
  location: Location;
  path: string;
  value: any;
  msg: any;
};
```

Represents an error caused when validating a single field, simple as that.

### `AlternativeValidationError`

```ts
type AlternativeValidationError = {
  type: 'alternative';
  msg: any;
  nestedErrors: FieldValidationError[];
};
```

Represents an error caused when all alternatives (e.g. in [`oneOf()`](./one-of.md)) were invalid.
`nestedErrors` contains a flat list of the individual field errors.

### `GroupedAlternativeValidationError`

```ts
type AlternativeValidationError = {
  type: 'alternative_grouped';
  msg: any;
  nestedErrors: FieldValidationError[][];
};
```

Represents an error caused when all alternatives (e.g. in [`oneOf()`](./one-of.md)) were invalid.
`nestedErrors` contains the list of the individual field errors, grouped by the alternative.

### `UnknownFieldValidationError`

```ts
type UnknownFieldsError = {
  type: 'unknown_fields';
  msg: any;
  fields: { path: string; location: Location; value: any }[];
};
```

Represents an error caused when one or more fields are unknown; that is, they didn't have a validation
chain when `checkExact()` kicked off.
`fields` contains the list of all unknown fields' paths, locations and values.

### `ValidationError`

Any of the validation errors.
It's possible to determine what the error actually is by looking at its `type` property:

```ts
switch (error.type) {
  case 'field':
    // `error` is a `FieldValidationError`
    console.log(error.path, error.location, error.value);
    break;

  case 'alternative':
    // `error` is an `AlternativeValidationError`
    console.log(error.nestedErrors);
    break;

  case 'alternative_grouped':
    // `error` is a `GroupedAlternativeValidationError`
    error.nestedErrors.forEach((nestedErrors, i) => {
      console.log(`Errors from chain ${i}:`);
      console.log(nestedErrors);
    });
    break;

  case 'unknown_fields':
    // `error` is an `UnknownFieldsError`
    console.log(error.fields);
    break;

  default:
    // Error is not any of the known types! Do something else.
    throw new Error(`Unknown error type ${error.type}`);
}
```

:::info

If you're using TypeScript, this technique is known as [discriminated unions](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions).

:::

## `ErrorFormatter<T>` {#errorformatter}

```ts
type ErrorFormatter<T> = (error: ValidationError) => T;
```

A function used to format errors returned by methods such as [`Result#mapped()`](#mapped) and [`Result#array()`](#array).
It takes the [unformatted error](#validationerror) and must return a new value.
