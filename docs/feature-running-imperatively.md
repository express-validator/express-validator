---
id: running-imperatively
title: Running validations imperatively
---

express-validator favors the declarative way of doing things that express middlewares bring.
This means most of the APIs _look and work better_ when simply passed into an express route handler.

You can, however, give control of running these validations to your own middleware/route handler.  
This is possible with the use of the declarative method `run(req)`, available on both
[validation chain](api-validation-chain.md#runreq) and [sanitization chains](api-sanitization-chain.md#runreq).

Check the examples below to understand how this method can help you:

## Example: standardized validation error response
```js
// can be reused by many routes
const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};

app.post('/api/create-user', validate([
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
]), async (req, res, next) => {
  // request is guaranteed to not have any validation errors.
  const user = await User.create({ ... });
});
```

## Example: validating with a condition
```js
app.post('/update-settings', [
  body('email').isEmail(),
  body('password').optional().isLength({ min: 6 })
], async (req, res, next) => {
  // if a password has been provided, then a confirmation must also be provided.
  if (req.body.password) {
    await body('passwordConfirmation')
      .equals(req.body.password).withMessage('passwords do not match')
      .run(req);
  }

  // Check the validation errors, and update the user's settings.
});
```
