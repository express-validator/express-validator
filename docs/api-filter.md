---
id: filter-api
title: Sanitization middlewares
---

These methods are all available via `require('express-validator')`.

> These sanitization-only middlewares have been deprecated, as the [validation ones](api-check.md)
offer the same functionality, and much more.
> They will be removed eventually.

## `sanitize(fields)`
- `field`: a string or an array of strings of field names to validate against.
> *Returns:* a [Sanitization Chain](api-sanitization-chain.md)

Creates a sanitization chain for one or more fields. They may be located in any of the following request objects:
- `req.body`
- `req.cookies`
- `req.params`
- `req.query`

_* `req.headers` is **not** supported at the moment._

If any of the fields are present in more than one location, then all instances of that field value will be sanitized.

## `sanitizeBody(fields)`
Same as `sanitize(fields)`, but only sanitizing `req.body`.

## `sanitizeCookie(fields)`
Same as `sanitize(fields)`, but only sanitizing `req.cookies`.

## `sanitizeParam(fields)`
Same as `sanitize(fields)`, but only sanitizing `req.params`.

## `sanitizeQuery(fields)`
Same as `sanitize(fields)`, but only sanitizing `req.query`.

## `buildSanitizeFunction(locations)`
- `locations`: an array of request locations to gather data from.  
   May include any of `body`, `cookies`, `params` or `query`.
> *Returns:* a variant of [`sanitize()`](#sanitizefields) sanitizing the given request locations.

Creates a variant of [`sanitize()`](#sanitizefields) that sanitizes the given request locations.

```js
const { buildSanitizeFunction } = require('express-validator');
const sanitizeBodyAndQuery = buildSanitizeFunction(['body', 'query']);

app.put('/update-product', [
  // id being either in req.body or req.query will be converted to int
  sanitizeBodyAndQuery('id').toInt()
], productUpdateHandler)
```