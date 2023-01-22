---
id: filter-api
title: Sanitization middlewares
---

These methods are all available via `require('express-validator')`.

> These sanitization-only middlewares have been deprecated, as **the [validation middlewares](api-check.md)
> offer the same functionality**, and much more.
> They will be removed eventually.

## `sanitize(fields)`

- `field`: a string or an array of strings of field names to validate against.

> _Returns:_ a [Sanitization Chain](api-sanitization-chain.md)

> [Prefer using `check()` instead](api-check.md#checkfields-message). This function has been deprecated.

Creates a sanitization chain for one or more fields. They may be located in any of the following request objects:

- `req.body`
- `req.cookies`
- `req.params`
- `req.query`

_\* `req.headers` is **not** supported at the moment._

If any of the fields are present in more than one location, then all instances of that field value will be sanitized.

## `sanitizeBody(fields)`

Same as `sanitize(fields)`, but only sanitizing `req.body`.

> [Prefer using `body()` instead](api-check.md#bodyfields-message). This function has been deprecated.

## `sanitizeCookie(fields)`

Same as `sanitize(fields)`, but only sanitizing `req.cookies`.

> [Prefer using `cookie()` instead](api-check.md#cookiefields-message). This function has been deprecated.

## `sanitizeParam(fields)`

Same as `sanitize(fields)`, but only sanitizing `req.params`.

> [Prefer using `param()` instead](api-check.md#paramfields-message). This function has been deprecated.

## `sanitizeQuery(fields)`

Same as `sanitize(fields)`, but only sanitizing `req.query`.

> [Prefer using `query()` instead](api-check.md#queryfields-message). This function has been deprecated.

## `buildSanitizeFunction(locations)`

- `locations`: an array of request locations to gather data from.  
   May include any of `body`, `cookies`, `params` or `query`.

> _Returns:_ a variant of [`sanitize()`](#sanitizefields) sanitizing the given request locations.

> [Prefer using `buildCheckFunction()` instead](api-check.md#buildcheckfunctionlocations). This function has been deprecated.

Creates a variant of [`sanitize()`](#sanitizefields) that sanitizes the given request locations.

```js
const { buildSanitizeFunction } = require('express-validator');
const sanitizeBodyAndQuery = buildSanitizeFunction(['body', 'query']);

app.put(
  '/update-product',
  // id being either in req.body or req.query will be converted to int
  sanitizeBodyAndQuery('id').toInt(),
  productUpdateHandler,
);
```
