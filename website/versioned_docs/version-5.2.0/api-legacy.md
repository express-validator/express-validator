---
id: version-5.2.0-legacy-api
title: Legacy API
original_id: legacy-api
---

The "legacy API" is the same API used by version 3 and older releases of express-validator.

It's based around setting a global middleware in your express app and decorating the request object with new methods.

> This API **MUST NOT** be used by new apps, since it may not receive new updates and can even be removed in a future major version.

## Setup
You must mount the middleware in your app before you get access to the validation/sanitization methods:

```js
const expressValidator = require('express-validator');
app.use(expressValidator(middlewareOptions));
```

## Middleware options
- `errorFormatter (param, msg, value, location)`: a function that formats the error objects before returning them to your route handlers.
- `customValidators`: an object where you can specify custom validators.  
The key will be the name of the validator, while the value is the validation function, receiving the value and any option.
- `customSanitizers`: an object where you can specify custom sanitizers.  
The key will be the name of the sanitizer, while the value is the sanitization function, receiving the value and any option.

## Legacy Validation Chain
The Legacy Validation Chain instances provides further functionality than the one provided by the base [Validation Chain](api-validation-chain.md) objects.  
It also differs in that the legacy one is not a middleware *per se*.

Any custom validator specified in the middleware will be made available 
in instances of this validation chain.

Additionally, the following validators are also available:

- `.notEmpty()`: alias of `.isLength({ min: 1 })`
- `.len()`: alias of `.isLength()`

## `req.check(field[, message])`
- `field`: the name of a single field to validate against.
- `message` *(optional)*: an error message to use when failed validators don't specify a message. Defaults to `Invalid value`.
> *Returns:* a [legacy validation chain](#legacy-validation-chain)

Creates a validation chain for one field. It may be located in any of the following request objects:
- `req.params`
- `req.query`
- `req.body`
- `req.headers`
- `req.cookies`

If it's present in more than one location, then only the first one (following the above order) will be validated against.

> This function is also aliased as `req.assert()` and `req.validate()`.

## `req.checkBody(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.body`.

## `req.checkCookies(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.cookies`.

## `req.checkHeaders(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.headers`.

## `req.checkParams(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.params`.

## `req.checkQuery(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.query`.

## `req.sanitize(field)`
> *Returns:* a sanitizer chain

Creates a sanitizer chain that, when any of the sanitization methods is used, the return value is the sanitized value.  
Also, the parameter is sanitized in-place; that is, in the below example,
`req.body.comment` will be updated to the sanitized value.

```js
const comment = req.sanitize('comment').trim();
console.log(comment === req.body.comment);
```

If the sanitized parameter is present in more than one location (eg `req.query.comment` and `req.body.comment`), the will all be sanitized.

> This function is also aliased as `req.filter()`.

## `req.sanitizeBody(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.body`.

## `req.sanitizeCookies(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.cookies`.

## `req.sanitizeHeaders(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.headers`.

## `req.sanitizeParams(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.params`.

## `req.sanitizeQuery(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.query`.

## `req.getValidationResult()`
> *Returns:* a promise for a [Validation Result](api-validation-result.md) object

Runs all validations and returns a validation result object for the errors gathered, for both sync and async validators.

## `req.asyncValidationErrors([mapped])`
- `mapped` *(optional)*: whether the result must be an object instead of an array. Defaults to `false`.
> *Returns:* a promise which will resolve in case all validators passed, or reject with an array of errors or an object of errors (in case `mapped` argument is `true`).

Runs all validations and returns the errors gathered for all of them.

## `req.validationErrors([mapped])`
- `mapped` *(optional)*: whether the result must be an object instead of an array. Defaults to `false`.
> *Returns:* `false` if no errors happened, an array of errors or an object of errors (in case `mapped` argument is `true`).

Runs all validations and returns the errors gathered *only* for the completed validators.  
This probably means any async validator will not be completed by the time this method responds.

## Schema validation
All `req.check` methods can do schema validation. The schema syntax is the same as described in [Schema Validation](feature-schema-validation.md).