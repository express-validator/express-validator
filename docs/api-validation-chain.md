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

### `.exists(options)`
- `options` *(optional)*: an object of options to customize the behavior of exists.
> *Returns:* the current validation chain instance

Adds a validator to check for the existence of the current fields in the request.
This means the value of the fields may not be `undefined`; all other values are acceptable.

You can customize this behavior by passing an object with the following options:
- `checkNull`: if `true`, fields with `null` values will not exist
- `checkFalsy`: if `true`, fields with falsy values (eg `""`, `0`, `false`, `null`) will also not exist

### `.isArray()`
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

### `.optional(options)`
- `options` *(optional)*: an object of options to customize the behaviour of optional.
> *Returns:* the current validation chain instance

Marks the current validation chain as optional.  
This is useful to remove values that are not essential to your busines and that would cause validation failures in case they were not provided in the request.

By default, fields with `undefined` values will be ignored from the validation.

You can customize this behavior by passing an object with the following options:
- `nullable`: if `true`, fields with `null` values will be considered optional
- `checkFalsy`: if `true`, fields with falsy values (eg `""`, `0`, `false`, `null`) will also be considered optional

### `.run(req)`
> *Returns:* a promise that resolves when the validation chain ran.

Runs the current validation chain in an imperative way.

```js
app.post('/create-user', async (req, res, next) => {
  await check('email').isEmail().run(req);
  await check('password').isLength({ min: 6 }).run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({ errors: result.array() });
  }

  // user can be created now!
});
```

### `.withMessage(message)`
- `message`: the error message to use for the previous validator
> *Returns:* the current validation chain instance

Sets the error message for the previous validator.  
This will have precedence over errors thrown by a custom validator.

To build dynamic messages, see also [Dynamic Messages](feature-error-messages.md#dynamic-messages).
