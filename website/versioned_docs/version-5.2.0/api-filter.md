---
id: filter-api
title: filter API
---

These methods are all available via `require('express-validator/filter')`.

## `matchedData(req[, options])`
- `req`: the express request object.
- `options` *(optional)*: an object which accepts the following options:
  - `onlyValidData`: if set to `false`, the returned value includes data from fields
    that didn't pass their validations. Defaults to `true`.
  - `locations`: an array of locations to extract the data from. The acceptable values include
    `body`, `cookies`, `headers`, `params` and `query`. Defaults to `undefined`, which means all locations.
> *Returns:* an object of data validated by the `check` APIs.

Extracts data validated by the `check` APIs from the request and builds
an object with them. Nested paths and wildcards are properly handled as well.

```js
// Suppose the request looks like this:
// req.query = { from: '2017-01-12' }
// req.body = { to: '2017-31-12' }

app.post('/room-availability', check(['from', 'to']).isISO8601(), (req, res, next) => {
  const queryData = matchedData(req, { locations: ['query'] });
  const bodyData = matchedData(req, { locations: ['body'] });
  const allData = matchedData(req);
  console.log(queryData); // { from: '2017-01-12' }
  console.log(bodyData);  // { to: '2017-31-12' }
  console.log(allData);   // { from: '2017-01-12', to: '2017-31-12' }
});
```

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
const { buildSanitizeFunction } = require('express-validator/filter');
const sanitizeBodyAndQuery = buildSanitizeFunction(['body', 'query']);

app.put('/update-product', [
  // id being either in req.body or req.query will be converted to int
  sanitizeBodyAndQuery('id').toInt()
], productUpdateHandler)
```