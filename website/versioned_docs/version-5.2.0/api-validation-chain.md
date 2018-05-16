---
id: version-5.2.0-validation-chain-api
title: Validation Chain API
original_id: validation-chain-api
---

Any of the validation and sanitization methods listed by [validator.js](https://github.com/chriso/validator.js) are made available in all validation chains created by express-validator, as long as we're supporting the most up-to-date validator version.  
If you use any of the sanitizers together with validators, the validated value is the sanitized one.

**Note:** Chains are mutable. Every time you call one of its methods, you're adding more behavior to the same chain.  
Keep this in mind and note that you probably want to use a factory function when reusing some chain base.

Additionally, the following methods are also available:

## `.custom(validator)`
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

## `.customSanitizer(sanitizer)`
Same as [`.customSanitizer` from the Sanitization Chain](#customsanitizersanitizer).

## `.exists()`
> *Returns:* the current validation chain instance

Adds a validator to check for the existence of the current fields in the request.
This means the value of the fields may not be `undefined`; all other values are acceptable.

## `.isArray()`
> *Returns:* the current validation chain instance

Adds a validator to check if a value is an array.

## `.isString()`
> *Returns:* the current validation chain instance

Adds a validator to check if a value is a string.

## `.not()`
> *Returns:* the current validation chain instance

Negates the result of the next validator.

```js
check('weekday').not().isIn(['sunday', 'saturday'])
```

## `.optional(options)`
- `options` *(optional)*: an object of options to customize the behaviour of optional.
> *Returns:* the current validation chain instance

Marks the current validation chain as optional.  
This is useful to remove values that are not essential to your busines and that would cause validation failures in case they were not provided in the request.

By default, fields with `undefined` values will be ignored from the validation.

You can customize this behavior by passing an object with the following options:
- `nullable`: if `true`, fields with `null` values will be considered optional
- `checkFalsy`: if `true`, fields with falsy values (eg `""`, `0`, `false`, `null`) will also be considered optional

## `.withMessage(message)`
- `message`: the error message to use for the previous validator
> *Returns:* the current validation chain instance

Sets the error message for the previous validator.  
This will have precedence over errors thrown by a custom validator.

To build dynamic messages, see also [Dynamic Messages](feature-dynamic-messages.md).