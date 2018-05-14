# express-validator

[![npm version](https://img.shields.io/npm/v/express-validator.svg)](https://www.npmjs.com/package/express-validator)
[![Build Status](https://img.shields.io/travis/express-validator/express-validator.svg)](http://travis-ci.org/express-validator/express-validator)
[![Dependency Status](https://img.shields.io/david/express-validator/express-validator.svg)](https://david-dm.org/express-validator/express-validator)
[![Coverage Status](https://img.shields.io/coveralls/express-validator/express-validator.svg)](https://coveralls.io/github/express-validator/express-validator?branch=master)

An [express.js]( https://github.com/visionmedia/express ) middleware for
[validator]( https://github.com/chriso/validator.js ).

- [Upgrade notice](#upgrade-notice)
- [Installation](#installation)
- [Usage](#usage)
- [Changelog](#changelog)
- [License](#license)

## Upgrade notice
If you're arriving here as a express-validator v3 user after upgrading to v4+, please check the [upgrade guide](UPGRADE_GUIDE.md) in order to find out what's different!

**Also please note that, starting with v5.0.0, no new features will be accepted into the legacy API. Only bug fixes will be made.**

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
const { matchedData, sanitize } = require('express-validator/filter');

app.post('/user', [
  check('username')
    // Every validator method in the validator lib is available as a
    // method in the check() APIs.
    // You can customize per validator messages with .withMessage()
    .isEmail().withMessage('username must be an email')

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
    return res.status(422).json({ errors: errors.mapped() });
  }

  // matchedData returns only the subset of data validated by the middleware
  const user = matchedData(req);
  createUser(user).then(user => res.json(user));
});
```

## Changelog

Check the [GitHub Releases page](https://github.com/express-validator/express-validator/releases).

## License

MIT License
