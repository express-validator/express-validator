---
id: schema-validation
title: Schema Validation
---

Schemas are a special, object-based way of defining validations or sanitizations on requests.  
At the root-level, you specify field paths as keys, and objects as values -- which define
the error messages, locations and validations/sanitizations.

Its syntax looks like this:

```js
const { checkSchema, validationResult } = require('express-validator');
app.put(
  '/user/:id/password',
  checkSchema({
    id: {
      // The location of the field, can be one or more of body, cookies, headers, params or query.
      // If omitted, all request locations will be checked
      in: ['params', 'query'],
      errorMessage: 'ID is wrong',
      isInt: true,
      // Sanitizers can go here as well
      toInt: true,
    },
    favoriteFruit: {
      // Custom validators can have any name, and you can have as many as needed
      isFruit: {
        // Any properties supported by standard validators like e.g. isInt, isMobilePhone
        // are supported by custom validators too
        errorMessage: 'Not a fruit',
        custom: (value, { req, location, path }) => {
          return value === 'banana';
        },
      },
      // ...and custom sanitizers! They can also have any name.
      toRipeFruit: {
        customSanitizer: (value, { req, location, path }) => {
          return `${value} is ripe!`;
        },
      },
    },
    password: {
      isLength: {
        errorMessage: 'Password should be at least 7 chars long',
        // Multiple options would be expressed as an array
        options: { min: 7 },
      },
    },
    firstName: {
      isUppercase: {
        // To negate a validator
        negated: true,
      },
      rtrim: {
        // Options as an array
        options: [' -'],
      },
    },
    // Support bail functionality in schemas
    email: {
      isEmail: {
        bail: true,
      },
    },
    // Support if functionality in schemas
    age: {
      isInt: {
        if: value => {
          return value !== '';
        },
      },
    },
    // Wildcards/dots for nested fields work as well
    'addresses.*.postalCode': {
      // Make this field optional when undefined or null
      optional: { options: { nullable: true } },
      isPostalCode: {
        options: 'US', // set postalCode locale here
      },
    },
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // handle the request as usual
  },
);
```
