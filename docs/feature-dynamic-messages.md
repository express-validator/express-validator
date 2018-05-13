---
id: dynamic-messages
title: Dynamic Messages
---

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