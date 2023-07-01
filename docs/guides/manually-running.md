---
title: Manually running validations
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

express-validator favors the declarative way of doing things that express middlewares bring.
This means most of the APIs look and work better when simply passed into an express route handler.

You can, however, take control of running these validations into your own middleware/route handler.

This is possible in express-validator functions which return an object which implements the
[`ContextRunner`](../api/misc.md#contextrunner), an interface implemented by all of
[`ValidationChain`](../api/validation-chain.md), [`checkExact()`](../api/check-exact.md),
[`checkSchema()`](../api/check-schema.md) and [`oneOf`](../api/one-of.md).

Check the examples below to understand how this method can help you:

## Example: creating own validation runner

<Tabs>
<TabItem value="js" label="JavaScript">

```js
const express = require('express');
const { validationResult, ValidationChain } = require('express-validator');
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
const validate = validations => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

app.post('/signup', validate([
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
]), async (req, res, next) => {
  // request is guaranteed to not have any validation errors.
  const user = await User.create({ ... });
});
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```typescript
import express from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
const validate = (validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

app.post('/signup', validate([
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
]), async (req, res, next) => {
  // request is guaranteed to not have any validation errors.
  const user = await User.create({ ... });
});
```

</TabItem>
</Tabs>

## Example: validating with a condition

```ts
import { body, matchedData } from 'express-validator';
app.post(
  '/update-settings',
  body('email').isEmail(),
  body('password').optional().isLength({ min: 6 }),
  async (req, res, next) => {
    // if a password has been provided, then a confirmation must also be provided.
    const { password } = matchedData(req);
    if (password) {
      await body('passwordConfirmation')
        .equals(password)
        .withMessage('passwords do not match')
        .run(req);
    }

    // Check the validation errors, and update the user's settings.
  },
);
```

:::note

This is only an example of how you could use the manual running of validations.
You should prefer creating conditional validation chains with the use of
[`.if()`](../api/validation-chain.md#if) instead.

:::
