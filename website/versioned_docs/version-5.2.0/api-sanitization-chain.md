---
id: sanitization-chain-api
title: Sanitization Chain API
---

The sanitization chain is a middleware, and it should be passed to an Express route handler.  
When the middleware runs, it will modify each field in place, applying each of the sanitizers in the order they were specified:

```js
app.get('/', sanitizeBody('trimMe').trim(), (req, res, next) => {
  // If req.body.trimMe was originally "  something ",
  // its sanitized value will be "something"
  console.log(req.body.trimMe);
});
```

Any of the sanitization methods listed by [validator.js](https://github.com/chriso/validator.js) are made available in all sanitization chains created by express-validator, as long as we're supporting the most up-to-date validator version.

Additionally, the following methods are also available:

## `.customSanitizer(sanitizer)`
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