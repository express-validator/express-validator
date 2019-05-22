---
id: sanitization-chain-api
title: Sanitization Chain API
---

The sanitization chain is a middleware, and it _should_ be passed to an Express route handler.

You can add as many sanitizers to a chain as you need.  
When the middleware runs, it will modify each field in place, applying each of the sanitizers in the order they were specified:

```js
app.get('/', sanitizeBody('trimMe').trim(), (req, res, next) => {
  // If req.body.trimMe was originally "  something ",
  // its sanitized value will be "something"
  console.log(req.body.trimMe);
});
```

## Standard sanitizers
All sanitizers listed by validator.js are made available within a Sanitization Chain,
and are called "standard sanitizers" in express-validator.

This means you can use any of those methods, e.g. `normalizeEmail`, `trim`, `toInt`, etc.

> **For a complete list of standard sanitizers and their options**,
> please check [validator.js' docs](https://github.com/chriso/validator.js#sanitizers).

## Additional methods
In addition to the standard sanitizers, the following methods are also available within a Sanitization Chain:

### `.customSanitizer(sanitizer)`
- `sanitizer(value, { req, location, path })`: the custom sanitizer function.  
  Receives the value of the field being sanitized, as well as the express request, the location and the field path.
> *Returns:* the current sanitization chain instance

Adds a custom sanitizer to the current sanitization chain. It must synchronously return the new value.

Example:

```js
app.get('/object/:id', sanitizeParam('id').customSanitizer((value, { req }) => {
  return req.query.type === 'user' ? ObjectId(value) : Number(value);
}), objectHandler)
```