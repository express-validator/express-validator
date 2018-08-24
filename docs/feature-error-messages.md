---
id: custom-error-messages
title: Custom Error Messages
---

express-validator's default error message is a simple `Invalid value`.  
That's enough to cover all fields without being too opinionated.

You can, however, specify meaningful error messages in a variety of ways.

## Error message levels
### Validator Level
When you want fine grained control over the error message of each validator,
you may specify them using the [`.withMessage()` method](api-validation-chain.md#withmessagemessage).

```js
const { check } = require('express-validator/check');

app.post('/user', [
  // ...some other validations...
  check('password')
    .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
    .matches(/\d/).withMessage('must contain a number')
], (req, res) => {
  // Handle the request somehow
});
```

In the example above, if the password is less than 5 characters long, an error with the message
`must be at least 5 chars long` will be reported.  
If it also doesn't contain a number, then an error with the message `must contain a number` will be
reported.

### Custom Validator Level
If you're using a custom validator, then it may very well throw or reject promises to indicate an invalid value.  
In these cases, the error gets reported with a message that's equal to what was thrown by the validator:

```js
const { check } = require('express-validator/check');

app.post('/user', [
  check('email').custom(value => {
    return User.findByEmail(value).then(user => {
      if (user) {
        return Promise.reject('E-mail already in use');
      }
    });
  }),
  check('password').custom((value, { req }) => {
    if (value !== req.body.passwordConfirmation) {
      throw new Error('Password confirmation is incorrect');
    }
  })
], (req, res) => {
  // Handle the request somehow
});
```

### Field Level
Messages can be specified at the field level by using the second parameter of the
[validation chain creators](api-check.md#check-field-message).

Theses messages are used as fall backs when a validator doesn't specify its own message:

```js
const { check } = require('express-validator/check');

app.post('/user', [
  // ...some other validations...
  check('password', 'The password must be 5+ chars long and contain a number')
    .not().isIn(['123', 'password', 'god']).withMessage('Do not use a common word as the password')
    .isLength({ min: 5 })
    .matches(/\d/)
], (req, res) => {
  // Handle the request somehow
});
```

In the example above, when the `password` field is shorter than 5 characters, or doesn't contain a number,
it will be reported with the message `The password must be 5+ chars long and contain a number`,
as these validators didn't specify a message of their own.

## Dynamic messages

You can build dynamic validation messages by providing functions anywhere a validation message is supported.  
This is specially useful if you use a translation library to provide tailored messages:

```js
// check(field, withMessage) and .withMessage() work the same
check('something').isInt().withMessage((value, { req, location, path }) => {
  return req.translate('validation.message.path', { value, location, path });
}),
check('somethingElse', (value, { req, location, path }) => {
  return req.translate('validation.message.path', { value, location, path });
}),

// oneOf is special though - it only receives the req object for now
oneOf([ someValidation, anotherValidation ], ({ req }) => {
  return req.translate('validation.multiple_failures');
});
```
