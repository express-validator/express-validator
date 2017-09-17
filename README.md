# express-validator

[![npm version](https://img.shields.io/npm/v/express-validator.svg)](https://www.npmjs.com/package/express-validator)
[![Build Status](https://img.shields.io/travis/ctavan/express-validator.svg)](http://travis-ci.org/ctavan/express-validator)
[![Dependency Status](https://img.shields.io/david/ctavan/express-validator.svg)](https://david-dm.org/ctavan/express-validator)
[![Coverage Status](https://img.shields.io/coveralls/ctavan/express-validator.svg)](https://coveralls.io/github/ctavan/express-validator?branch=master)

An [express.js]( https://github.com/visionmedia/express ) middleware for
[validator]( https://github.com/chriso/validator.js ).

- [Upgrade notice](#upgrade-notice)
- [Installation](#installation)
- [Usage](#usage)
- [`check` API](#check-api)
- [`filter` API](#filter-api)
- [Sanitization Chain API](#sanitization-chain-api)
- [Validation Chain API](#validation-chain-api)
- [Validation Result API](#validation-result-api)
- [Legacy API](#legacy-api)
- [Changelog](#changelog)
- [License](#license)

## Upgrade notice
If you're arriving here as a express-validator v3 user after upgrading to v4, please check the [upgrade guide](UPGRADE_GUIDE.md) in order to find out what's different!

## Installation
```
npm install express-validator
```

Also make sure that you have Node.js 6 or newer in order to use it.

## Usage
> The version 3 style of doing validations is still available.  
> Please check the [legacy API](#legacy-api) for the docs.

```javascript
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

app.post('/user', [
  check('username')
    // Every validator method in the validator lib is available as a
    // method in the check() APIs.
    // You can customize per validator messages with .withMessage()
    .isEmail().withMessage('must be an email')

    // Every sanitizer method in the validator lib is available as well!
    .trim()
    .normalizeEmail()

    // ...or throw your own errors using validators created with .custom()
    .custom(value => {
      return findUserByEmail(value).then(user => {
        throw new Error('this email is already in use');
      })
    }),

  // General error messages can be given as a 2nd argument in the check APIs
  check('password', 'passwords must be at least 5 chars long and contain one number')
    .isLength({ min: 5 })
    .matches(/\d/),

  // No special validation required? Just check if data exists:
  check('addresses.*.street').exists(),

  // Wildcards * are accepted!
  check('addresses.*.postalCode').isPostalCode(),

  // Sanitize the number of each address, making it arrive as an integer
  sanitize('addresses.*.number').toInt()
], (req, res, next) => {
  // Get the validation result whenever you want; see the Validation Result API for all options!
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: err.mapped() });
  }

  // matchedData returns only the subset of data validated by the middleware
  const user = matchedData(req);
  createUser(user).then(user => res.json(user));
});
```

---

## `check` API
These methods are all available via `require('express-validator/check')`.

### `check(field[, message])`
- `field`: a string or an array of strings of field names to validate against.
- `message` *(optional)*: an error message to use when failed validators don't specify a message. Defaults to `Invalid value`.
> *Returns:* a [Validation Chain](#validation-chain-api)

Creates a validation chain for one or more fields. They may be located in any of the following request objects:
- `req.body`
- `req.cookies`
- `req.headers`
- `req.params`
- `req.query`

If any of the fields are present in more than one location, then all instances of that field value must pass the validation.

The validators will always be executed serially for the same field.  
This means that if the chain targets more than one field, those will run in parallel, but each of their validators are serial.

### `body(fields[, message])`
Same as `check(fields[, message])`, but only checking `req.body`.

### `cookie(fields[, message])`
Same as `check(fields[, message])`, but only checking `req.cookies`.

### `header(fields[, message])`
Same as `check(fields[, message])`, but only checking `req.headers`.

### `param(fields[, message])`
Same as `check(fields[, message])`, but only checking `req.params`.

### `query(fields[, message])`
Same as `check(fields[, message])`, but only checking `req.query`.

### `oneOf(validationChains[, message])`
- `validationChains`: an array of [validation chains](#validation-chain-api) created with `check()` or any of its variations.
- `message` *(optional)*: an error message to use when all chains failed. Defaults to `Invalid value(s)`.
> *Returns:* a middleware instance

Creates a middleware instance that will ensure at least one of the given chains passes the validation.  
If none of the given chains passes, an error will be pushed to the `_error` pseudo-field,
using the given `message`, and the errors of each chain will be made available under a key `nestedErrors`.

Example:

```js
const { check, oneOf, validationResult } = require('express-validator/check');
app.post('/start-freelancing', oneOf([
  check('programming_language').isIn(['javascript', 'java', 'php']),
  check('design_tools').isIn(['photoshop', 'gimp'])
]), (req, res, next) => {
  try {
    validationResult(req).throw();

    // yay! we're good to start selling our skilled services :)))
    res.json(...);
  } catch (err) {
    // Oh noes. This user doesn't have enough skills for this...
    res.status(422).json(...);
  }
});
```

The execution of those validation chains are made in parallel,
while the execution within a chain still respects the rule defined in the [`check()` function](#checkfield-message).

### `validationResult(req)`
- `req`: the express request object.
> *Returns:* a [validation result](#validation-result-api) object

Extracts the validation errors from a request and makes it available in the form of a validation result object.

---

## `filter` API
These methods are all available via `require('express-validator/filter')`.

### `matchedData(req[, options])`
- `req`: the express request object.
- `options` *(optional)*: an object of options. Defaults to `{ onlyValidData: true }`
> *Returns:* an object of data validated by the `check` APIs.

Extracts data validated by the `check` APIs from the request and builds
an object with them. Nested paths and wildcards are properly handled as well.

By default, only valid data is included; this means if a field didn't pass
its validation, it won't be included in the returned object.  
You can include invalid data by passing the option `onlyValidData` as `false`.

### `sanitize(fields)`
- `field`: a string or an array of strings of field names to validate against.
> *Returns:* a [Sanitization Chain](#sanitization-chain-api)

Creates a sanitization chain for one or more fields. They may be located in any of the following request objects:
- `req.body`
- `req.cookies`
- `req.params`
- `req.query`

_* `req.headers` is **not** supported at the moment._

If any of the fields are present in more than one location, then all instances of that field value will be sanitized.

### `sanitizeBody(fields)`
Same as `sanitize(fields)`, but only sanitizing `req.body`.

### `sanitizeCookie(fields)`
Same as `sanitize(fields)`, but only sanitizing `req.cookies`.

### `sanitizeParam(fields)`
Same as `sanitize(fields)`, but only sanitizing `req.params`.

### `sanitizeQuery(fields)`
Same as `sanitize(fields)`, but only sanitizing `req.query`.

---

## Sanitization Chain API
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

---

## Validation Chain API
Any of the validation and sanitization methods listed by [validator.js](https://github.com/chriso/validator.js) are made available in all validation chains created by express-validator, as long as we're supporting the most up-to-date validator version.  
If you use any of the sanitizers together with validators, the validated value is the sanitized one.

Additionally, the following methods are also available:

### `.custom(validator)`
- `validator(value, { req, location, path })`: the custom validator function.  
Receives the value of the field being validated, as well as the express request, the location and the field path.
> *Returns:* the current validation chain instance

Adds a custom validator to the current validation chain.  
The custom validator may return a promise to indicate an async validation task. In case it's rejected, the field is considered invalid.

The custom validator may also throw JavaScript exceptions (eg `throw new Error()`) and return falsy values to indicate the field is invalid.

Example:

```js
app.post('/create-user', [
  check('password').exists(),
  check('passwordConfirmation', 'passwordConfirmation field must have the same value as the password field')
    .exists()
    .custom((value, { req }) => value === req.body.password)
], loginHandler);
```

### `.exists()`
> *Returns:* the current validation chain instance

Adds a validator to check for the existence of the current fields in the request.  
This means the value of the fields may not be `undefined`; any other values are acceptable.

### `.not()`
> *Returns:* the current validation chain instance

Negates the result of the next validator.

```js
check('weekday').not().isIn(['sunday', 'saturday'])
```

### `.optional(options)`
- `options` *(optional)*: an object of options to customize the optionality behaviour. Defaults to `{ checkFalsy: false }`.
> *Returns:* the current validation chain instance

Marks the current validation chain as optional.  
This is useful to remove values that are not essential to your busines and that would cause validation failures in case they were not provided in the request.

By default, this means fields with `undefined` values will be completely ignored.  
However, if you specify the option `{ checkFalsy: true }`, then falsy values (eg `""`, `0`, `false`, `null`) will also be ignored.

### `.withMessage(message)`
- `message`: the error message to use for the previous validator
> *Returns:* the current validation chain instance

Sets the error message for the previous validator.  
This will have precedence over errors thrown by a custom validator.

---

## Validation Result API
This is an unified API for dealing with errors, both in legacy and check APIs.

Each error returned by `.array()` and `.mapped()` methods have the following format by default:

```js
{
  "msg": "The error message",
  "param": "param.name.with.index[0]",
  "value": "param value",
  // Location of the param that generated this error.
  // It's either body, query, params, cookies or headers.
  "location": "body",

  // nestedErrors only exist when using the oneOf function
  "nestedErrors": [{ ... }]
}
```

### `.isEmpty()`
> *Returns:* a boolean indicating whether this result object contains no errors at all.

### `.formatWith(formatter)`
- `formatter(error)`: the function to use to format when returning errors.  
  The `error` argument is an object in the format of `{ location, msg, param, value, nestedErrors }`, as described above.
> *Returns:* this validation result instance

### `.array([options])`
- `options` *(optional)*: an object of options. Defaults to `{ onlyFirstError: false }`
> *Returns:* an array of validation errors.

Gets all validation errors contained in this result object.

If the option `onlyFirstError` is set to `true`, then only the first
error for each field will be included.

### `.mapped()`
> *Returns:* an object where the keys are the field names, and the values are the validation errors

Gets the first validation error of each failed field in the form of an object.

### `.throw()`
If this result object has errors, then this method will throw an exception
decorated with the same validation result API.

```js
try {
  validationResult(req).throw();
  // Oh look at ma' success! All validations passed!
} catch (err) {
  console.log(err.mapped()); // Oh noes!
}
```

---

## Legacy API
The "legacy API" is the same API used by version 3 and older releases of express-validator.

It's based around setting a global middleware in your express app and decorating the request object with new methods.

> This API **MUST NOT** be used by new apps, since it may not receive new updates and can even be removed in a future major version.

### Setup
You must mount the middleware in your app before you get access to the validation/sanitization methods:

```js
const expressValidator = require('express-validator');
app.use(expressValidator(middlewareOptions));
```

### Middleware options
- `errorFormatter (param, msg, value, location)`: a function that formats the error objects before returning them to your route handlers.
- `customValidators`: an object where you can specify custom validators.  
The key will be the name of the validator, while the value is the validation function, receiving the value and any option.
- `customSanitizers`: an object where you can specify custom sanitizers.  
The key will be the name of the sanitizer, while the value is the sanitization function, receiving the value and any option.

### Legacy Validation Chain
The Legacy Validation Chain instances provides further functionality than the one provided by the base [Validation Chain](#validation-chain-api) objects.  
It also differs in that the legacy one is not a middleware *per se*.

Any custom validator specified in the middleware will be made available 
in instances of this validation chain.

Additionally, the following validators are also available:

- `.notEmpty()`: alias of `.isLength({ min: 1 })`
- `.len()`: alias of `.isLength()`

### `req.check(field[, message])`
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

### `req.checkBody(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.body`.

### `req.checkCookies(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.cookies`.

### `req.checkHeaders(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.headers`.

### `req.checkParams(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.params`.

### `req.checkQuery(field[, message])`
Same as `req.check(field[, message])`, but only checking `req.query`.

### `req.sanitize(field)`
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

### `req.sanitizeBody(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.body`.

### `req.sanitizeCookies(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.cookies`.

### `req.sanitizeHeaders(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.headers`.

### `req.sanitizeParams(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.params`.

### `req.sanitizeQuery(field[, message])`
Same as `req.sanitize(field[, message])`, but only sanitizing `req.query`.

### `req.getValidationResult()`
> *Returns:* a promise for a [Validation Result](#validation-result-api) object

Runs all validations and returns a validation result object for the errors gathered, for both sync and async validators.

### `req.asyncValidationErrors([mapped])`
- `mapped` *(optional)*: whether the result must be an object instead of an array. Defaults to `false`.
> *Returns:* a promise which will resolve in case all validators passed, or reject with an array of errors or an object of errors (in case `mapped` argument is `true`).

Runs all validations and returns the errors gathered for all of them.

### `req.validationErrors([mapped])`
- `mapped` *(optional)*: whether the result must be an object instead of an array. Defaults to `false`.
> *Returns:* `false` if no errors happened, an array of errors or an object of errors (in case `mapped` argument is `true`).

Runs all validations and returns the errors gathered *only* for the completed validators.  
This probably means any async validator will not be completed by the time this method responds.

### Schema validation
All `req.check` methods can do schema validation. This is a special way of validating data were you pass an object of your expected schema, and all the validations you want:

```js
req.checkBody({
  email: {
    notEmpty: true,
    isEmail: true
  },
  password: {
    notEmpty: true,
    matches: {
      // more than one options must be passed as arrays
      options: ['someregex', 'i'],
      // single options may be passed directly
      // options: /someregex/i
    },
    errorMessage: 'Invalid password'
  },
  // Wildcards and nested paths are supported as well
  'name.first': {
    optional: {
      options: { checkFalsy: true }
    }
  },
  termsAndConditionsAgreement: {
    isBoolean: {
      errorMessage: 'should be a boolean'
    }
  }
});
```

---

## Changelog

Check the [GitHub Releases page](https://github.com/ctavan/express-validator/releases).

## License

MIT License
