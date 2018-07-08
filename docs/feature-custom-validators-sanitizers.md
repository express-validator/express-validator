---
id: custom-validators-sanitizers
title: Custom validators/sanitizers
---

Although express-validator offers plenty of handy validators and sanitizers through its underlying
dependency [validator.js](https://github.com/chriso/validator.js), it doesn't always suffices when
building your application.

For these cases, you may consider writing a custom validator or a custom sanitizer.

## Custom validator
A custom validator may be implemented by using the chain method [`.custom()`](api-validation-chain.md#customvalidator).
It takes a validator function.

Custom validators may return Promises to indicate an async validation (which will be awaited upon),
or `throw` any value/reject a promise to [use a custom error message](feature-error-messages.md#custom-validator-level).

### Example: checking if e-mail is in use
```js
const { body } = require('express-validator/check');

app.post('/user', body('email').custom(value => {
  return User.findUserByEmail(value).then(user => {
    if (user) {
      return Promise.reject('E-mail already in use');
    }
  });
}), (req, res) => {
  // Handle the request
});
```

### Example: checking if password confirmation matches password
```js
const { body } = require('express-validator/check');

app.post('/user', body('passwordConfirmation').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }
}), (req, res) => {
  // Handle the request
});
```

## Custom sanitizers
Custom sanitizers can be implemented by using the method `.customSanitizer()`, no matter if
the [validation chain one](api-validation-chain.md#customsanitizersanitizer) or
the [sanitization chain one](api-sanitization-chain.md#customsanitizersanitizer).  
Just like with the validators, you specify the sanitizer function, which _must_ be synchronous at the
moment.

### Example: converting to MongoDB's ObjectID
```js
const { sanitizeParam } = require('express-validator/filter');

app.post('/object/:id', sanitizeParam('id').customSanitizer(value => {
  return ObjectId(value);
}), (req, res) => {
  // Handle the request
});
```
