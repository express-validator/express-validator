---
id: schema-validation
title: Schema Validation
---

Schemas are a special, object-based way of defining validations or sanitizations on requests.  
At the root-level, you specify the field paths as the keys, and an object as values -- which define
the error messages, locations and validations/sanitizations.

Its syntaxs looks like this:

```js
const { checkSchema } = require('express-validator');
app.put('/user/:id/password', checkSchema({
  id: {
    // The location of the field, can be one or more of body, cookies, headers, params or query.
    // If omitted, all request locations will be checked
    in: ['params', 'query'],
    errorMessage: 'ID is wrong',
    isInt: true,
    // Sanitizers can go here as well
    toInt: true
  },
  myCustomField: {
    // Custom validators
    custom: {
      options: (value, { req, location, path }) => {
        return value + req.body.foo + location + path;
      }
    },
    // and sanitizers
    customSanitizer: {
      options: (value, { req, location, path }) => {
        let sanitizedValue;

        if (req.body.foo && location && path) {
          sanitizedValue = parseInt(value);
        } else {
          sanitizedValue = 0;
        }

        return sanitizedValue;
      }
    },
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 7 chars long',
      // Multiple options would be expressed as an array
      options: { min: 7 }
    }
  },
  firstName: {
    isUpperCase: {
      // To negate a validator
      negated: true,
    },
    rtrim: {
      // Options as an array
      options: [[" ", "-"]],
    },
  },
  // Wildcards/dots for nested fields work as well
  'addresses.*.postalCode': {
    // Make this field optional when undefined or null
    optional: { options: { nullable: true } },
    isPostalCode: true
  }
}), (req, res, next) => {
  // handle the request as usual
})
```
