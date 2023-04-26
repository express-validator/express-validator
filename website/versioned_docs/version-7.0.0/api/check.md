---
title: check
---

The `check()` function is the main API used for validating and sanitizing HTTP requests with express-validator.
It gives you access to all of the built-in validators, sanitizers, and a bunch of other utility
functions to shape the validation just the way you need.

## `check()`

```ts
import { check } from 'express-validator';
check(fields?: string | string[], message?: any): ValidationChain
```

**Parameters:**

| Name      | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| `fields`  | One or more field names to select. If omitted, selects the [whole request location][1]. |
| `message` | Which error message to use when a validator doesn't specify one.                        |

Creates a [validation chain](./validation-chain.md) for one or more fields.
Fields are selected from any of the following request locations:

- `req.body`
- `req.cookies`
- `req.headers`
- `req.query`
- `req.params`

If any of the fields is present in more than one location, then all instances of that field value
are processed by the validation chain.

## `body()`

```ts
import { body } from 'express-validator';
body(fields?: string | string[], message?: any): ValidationChain
```

Same as [`check()`](#check), but only checking `req.body`.

## `cookie()`

```ts
import { cookie } from 'express-validator';
cookie(fields?: string | string[], message?: any): ValidationChain
```

Same as [`check()`](#check), but only checking `req.cookies`.

## `header()`

```ts
import { header } from 'express-validator';
header(fields?: string | string[], message?: any): ValidationChain
```

Same as [`check()`](#check), but only checking `req.headers`.

## `param()`

```ts
import { param } from 'express-validator';
param(fields?: string | string[], message?: any): ValidationChain
```

Same as [`check()`](#params), but only checking `req.params`.

## `query()`

```ts
import { query } from 'express-validator';
query(fields?: string | string[], message?: any): ValidationChain
```

Same as [`check()`](#check), but only checking `req.query`.

[1]: ../guides/field-selection.md#whole-body-selection
