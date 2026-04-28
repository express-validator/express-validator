# User Registration Validation Example

This example demonstrates how to validate user registration input using express-validator in an Express.js application.

## Requirements

- Node.js
- Express
- express-validator

## Example

```js
import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express();
app.use(express.json());

app.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),

    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Must contain an uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Must contain a number'),

    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.status(201).json({ message: 'User registered successfully' });
  }
);

app.listen(3000, () => console.log('Server running'));
