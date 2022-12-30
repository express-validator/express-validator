---
id: check-api
title: check API
---

These methods are all available via `require('express-validator/check')`.

## `check([field, message])`
- `field` *(optional)*: a string or an array of strings of field names to validate against.
- `message` *(optional)*: an error message to use when failed validators don't specify a message. Defaults to `Invalid value`; see also [Dynamic Messages](feature-error-messages.md#dynamic-messages).
> *Returns:* a [Validation Chain](api-validation-chain.md)

Creates a validation chain for one or more fields. They may be located in any of the following request objects:
- `req.body`
- `req.cookies`
- `req.headers`
- `req.params`
- `req.query`

If any of the fields are present in more than one location, then all instances of that field value must pass the validation.

**Note:** If `fields` is omitted, then the whole request location will be validated.
This is only useful for `req.body`, though; see [Whole Body Validation](feature-whole-body-validation.md) for examples.

The validators will always be executed serially for the same field.  
This means that if the chain targets more than one field, those will run in parallel, but each of their validators are serial.

## `body([fields, message])`
Same as `check([fields, message])`, but only checking `req.body`.

## `cookie([fields, message])`
Same as `check([fields, message])`, but only checking `req.cookies`.

## `header([fields, message])`
Same as `check([fields, message])`, but only checking `req.headers`.

## `param([fields, message])`
Same as `check([fields, message])`, but only checking `req.params`.

## `query([fields, message])`
Same as `check([fields, message])`, but only checking `req.query`.

## `checkSchema(schema)`
- `schema`: the schema to validate. Must comply with the format described in [Schema Validation](feature-schema-validation.md).
> *Returns:* an array of validation chains

## `oneOf(validationChains[, message])`
- `validationChains`: an array of [validation chains](api-validation-chain.md) created with `check()` or any of its variations,
  or an array of arrays containing validation chains.
- `message` *(optional)*: an error message to use when all chains failed. Defaults to `Invalid value(s)`; see also [Dynamic Messages](feature-error-messages.md#dynamic-messages).
> *Returns:* a middleware instance

Creates a middleware instance that will ensure at least one of the given chains passes the validation.  
If none of the given chains passes, an error will be pushed to the `_error` pseudo-field,
using the given `message`, and the errors of each chain will be made available under a key `nestedErrors`.

Example:

```js
const { check, oneOf, validationResult } = require('express-validator/check');
app.post('/start-freelancing', oneOf([
  check('programming_language').isIn(['javascript', 'java', 'php']),
  check('design_tools').isIn(['canva', 'photoshop', 'gimp'])
]), (req, res, next) => {
  try {
    validationResult(req).throw();

    // yay! we're good to start selling our skilled services :)))
    res.json(...);
  } catch (err) {
    // Oh noes. This user doesn't have enough skills for this...
    res.status(400).json(...);
  }
});
```

If an item of the array is an array containing validation chains, then all of those must pass in order for this
group be considered valid:

```js
// This protected route must be accessed either by passing both username + password,
// or by passing an access token
app.post('/protected/route', oneOf([
  [
    check('username').exists(),
    check('password').exists()
  ],
  check('access_token').exists()
]), someRouteHandler);
```

The execution of those validation chains are made in parallel,
while the execution within a chain still respects the rule defined in the [`check()` function](#check-field-message).

## `validationResult(req)`
- `req`: the express request object.
> *Returns:* a [validation result](api-validation-result.md) object

Extracts the validation errors from a request and makes it available in the form of a validation result object.

## `buildCheckFunction(locations)`
- `locations`: an array of request locations to gather data from.  
   May include any of `body`, `cookies`, `headers`, `params` or `query`.
> *Returns:* a variant of [`check()`](#check-field-message) checking the given request locations.

Creates a variant of [`check()`](#check-field-message) that checks the given request locations.

```js
const { buildCheckFunction } = require('express-validator/check');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);

app.put('/update-product', [
  // id must be either in req.body or req.query, and must be an UUID
  checkBodyAndQuery('id').isUUID()
], productUpdateHandler)
```