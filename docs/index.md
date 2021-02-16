---
id: index
title: Getting Started
---

express-validator is a set of [express.js](http://expressjs.com/) middlewares that wraps
[validator.js](https://github.com/validatorjs/validator.js) validator and sanitizer functions.

## Installation

Install it using npm (make sure that you have Node.js 8 or newer):

```
npm install --save express-validator
```

## Basic guide

> It's recommended that you have basic knowledge of the express.js module before you go on with
> this guide.

Let's get started by writing a basic route to create a user in the database:

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->

```js
const express = require('express');
const app = express();

app.use(express.json());
app.post('/user', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  }).then(user => res.json(user));
});
```

<!--TypeScript-->

```typescript
import express from 'express';
const app = express();

app.use(express.json());
app.post('/user', (req: express.Request, res: express.Response) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  }).then(user => res.json(user));
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

Then, you'll want to make sure that you validate the input and report any errors before creating the user:

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->

```js
// ...rest of the initial code omitted for simplicity.
const { body, validationResult } = require('express-validator');

app.post(
  '/user',
  // username must be an email
  body('username').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
      username: req.body.username,
      password: req.body.password,
    }).then(user => res.json(user));
  },
);
```

<!--TypeScript-->

```typescript
// ...rest of the initial code omitted for simplicity.
import { body, validationResult } from 'express-validator';

app.post(
  '/user',
  // username must be an email
  body('username').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  (req: express.Request, res: express.Response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
      username: req.body.username,
      password: req.body.password,
    }).then(user => res.json(user));
  },
);
```

<!--END_DOCUSAURUS_CODE_TABS-->

_Voila!_ Now, whenever a request that includes invalid `username` or `password` fields
is submitted, your server will respond like this:

```json
{
  "errors": [
    {
      "location": "body",
      "msg": "Invalid value",
      "param": "username"
    }
  ]
}
```

For all the available validators in express-validator (just like its options),
take a look at validator.js docs [here](https://github.com/validatorjs/validator.js#validators).

## What's next

This completes the basic guide on getting started with express-validator.  
You might want to continue reading about some of the more advanced features available:

- [Sanitization](feature-sanitization.md)
- [Custom validators/sanitizers](feature-custom-validators-sanitizers.md)
- [Custom error messages](feature-error-messages.md)
- [Wildcards](feature-wildcards.md)
- [Schema validation](feature-schema-validation.md)
