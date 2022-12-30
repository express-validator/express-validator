---
id: validation-chain-api
title: Validation Chain API
---

The validation chain is a middleware, and it _should_ be passed to an Express route handler.

You can add as many validators and sanitizers to a chain as you need.   
When the middleware runs, it will run each validator or sanitizer in the order they were specified;
this means if a sanitizer is specified before a validator, the validator will run with the sanitized
value.

> **Note:** Chains are mutable. Every time you call one of its methods, you're adding more behavior to the same chain.  
> Keep this in mind and note that you probably want to use a factory function when reusing some base chain.

## Standard validators
All validators listed by validator.js are made available within a Validation Chain,
and are called "standard validators" in express-validator.

This means you can use any of those methods, e.g. `isInt`, `isEmail`, `contains`, etc.

> **For a complete list of standard validators and their options**,
> please check [validator.js' docs](https://github.com/chriso/validator.js#validators).

## Sanitization Chain API
A validation chain also is a subset of the [Sanitization Chain](api-sanitization-chain.md), meaning
all standard sanitizers and its additional methods are available:

```js
app.post('/create-user', [
  // normalizeEmail() and toDate() are sanitizers, also available in the Sanitization Chain
  check('email').normalizeEmail().isEmail(),
  check('date-of-birth').isISO8601().toDate()
]);
```

## Additional methods
In addition to the standard validators and the [Sanitization Chain API](api-sanitization-chain.md),
the following methods are also available within a Validation Chain:

### `.bail()`
> *Returns:* the current validation chain instance

Stops running validations if any of the previous ones have failed.  
Useful to prevent a custom validator that touches a database or external API from running when you
know it will fail.

`.bail()` can be used multiple times in the same validation chain if needed:

```js
app.post('/', [
  check('username')
    .isEmail()
    .bail()
    // If username is not an email, checkBlacklistedDomain will never run
    .custom(checkBlacklistedDomain)
    .bail()
    // If username is not an email or has a blacklisted domain, checkEmailExists will never run
    .custom(checkEmailExists);
]);
```

### `.custom(validator)`
- `validator(value, { req, location, path })`: the custom validator function.  
Receives the value of the field being validated, as well as the express request, the location and the field path.
> *Returns:* the current validation chain instance

Adds a custom validator to the current validation chain.  
The custom validator may return a promise to indicate an async validation task.
- If it's rejected, the field is considered invalid;
- If it's resolved, the field is considered valid **regardless of the returned value**.

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

### `.exists(options)`
- `options` *(optional)*: an object of options to customize the behavior of exists.
> *Returns:* the current validation chain instance

Adds a validator to check for the existence of the current fields in the request.
This means the value of the fields may not be `undefined`; all other values are acceptable.

You can customize this behavior by passing an object with the following options:
- `checkNull`: if `true`, fields with `null` values will not exist
- `checkFalsy`: if `true`, fields with falsy values (eg `""`, `0`, `false`, `null`) will also not exist

### `.if(condition)`
- `condition`: the condition for this Validation Chain to continue validating.
> *Returns:* the current validation chain instance

Adds a condition for deciding if validation should continue on a field or not.

The condition can be either:
- A custom validator-like function: `condition(value, { req, path, location })`.
  Receives the value of the field being validated, as well as the express request, the location and the field path.

  If it returns truthy or a promise that resolves, the validation chain will continue
running. If it returns falsy, a promise that rejects or if it throws, the validation chain will stop.  
- A validation chain [created through `check()` or similar functions](api-check.md#check-field-message).

  If running that chain would produce errors, then the validation chain will stop.

```js
body('oldPassword')
  // if the new password is provided...
  .if((value, { req }) => req.body.newPassword)
  // OR
  .if(body('newPassword').exists())
  // ...then the old password must be too...
  .not().empty()
  // ...and they must not be equal.
  .custom((value, { req }) => value !== req.body.newPassword)
```

### `.isArray(options)`
- `options` *(optional)*: an object which accepts the following options:
  - `min`: minimum array length.
  - `max`: maximum array length.
> *Returns:* the current validation chain instance

Adds a validator to check if a value is an array.

### `.isString()`
> *Returns:* the current validation chain instance

Adds a validator to check if a value is a string.

### `.not()`
> *Returns:* the current validation chain instance

Negates the result of the next validator.

```js
check('weekday').not().isIn(['sunday', 'saturday'])
```

### `.notEmpty()`
> *Returns:* the current validation chain instance

Adds a validator to check if a value is not empty; that is, a string with a length of 1 or bigger.

```js
check('username').notEmpty()
```

### `.optional(options)`
- `options` *(optional)*: an object of options to customize the behaviour of optional.
> *Returns:* the current validation chain instance

Marks the current validation chain as optional.  
This is useful to remove values that are not essential to your business and that would cause validation failures in case they were not provided in the request.

By default, fields with `undefined` values will be ignored from the validation.

You can customize this behavior by passing an object with the following options:
- `nullable`: if `true`, fields with `null` values will be considered optional
- `checkFalsy`: if `true`, fields with falsy values (eg `""`, `0`, `false`, `null`) will also be considered optional

### `.run(req[, options])`
- `req`: the current express request to validate.
- `options` *(optional)*: an object of options to customize how the chain will be run:
  - `dryRun`: defines whether errors and sanitizations won't be persisted to `req`. Defaults to `false`.
> *Returns:* a promise for a [`Result`](api-validation-result.md#result) that resolves when the validation chain ran.

Runs the current validation chain in an imperative way.

```js
app.post('/create-user', async (req, res, next) => {
  await check('email').isEmail().run(req);
  await check('password').isLength({ min: 6 }).run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  // user can be created now!
});
```

You may also pass `dryRun` option so that you can know if the request has any problems, without them
being accounted among other request errors.

```js
app.post('/api/*', async (req, res, next) => {
  const tokenResult = await check('token').notEmpty().custom(checkMyTokenFormat).run(req, { dryRun: true });
  if (tokenResult.isEmpty()) {
    // The token looks good, so try to authenticate it
    await req.authenticate();
  } else {
    // The token is not good, so proceed as an unauthenticated request.
  }
});

app.post('/api/create-todo', async (req, res, next) => {
  await check('text').notEmpty().run(req);
  await check('done').isBoolean().run(req);
  
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // text and/or done have errors.
    // Errors in the token as validated in the previous route are not accounted here.
  }
});
```

### `.withMessage(message)`
- `message`: the error message to use for the previous validator
> *Returns:* the current validation chain instance

Sets the error message for the previous validator.  
This will have precedence over errors thrown by a custom validator.

To build dynamic messages, see also [Dynamic Messages](feature-error-messages.md#dynamic-messages).
