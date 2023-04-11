---
title: Customizing express-validator
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If the application you're building is anything but a very simple one, you'll need validators,
sanitizers and error messages beyond the ones built into express-validator sooner or later.

That's why it has a number of ways in which it can be customized, some of which are introduced on this page.

## Custom Validators and Sanitizers

A classic need that express-validator can't fulfill for you, and that you might run into,
is validating whether an e-mail address is in use or not when a user signing up.

It's possible to do this in express-validator by implementing a custom validator.

Custom validators are simple functions that receive the field value and some information about it,
and have to return a value that will determine if the field is valid or not.

Custom sanitizers are similar, except that they instead transform the value of the field.

### Implementing a custom validator

Custom validators must return a truthy value to indicate that the field is valid, or falsy to indicate it's invalid.

Custom validators can be asynchronous, in which case it can return a promise. The returned promise is awaited on, and it must resolve in order for the field to be valid. If it rejects, the field is deemed invalid.

If a custom validator throws, it's also considered invalid.

For example, in order to check that an e-mail is not in use:

```js
app.post(
  '/create-user',
  body('email').custom(async value => {
    const user = await UserCollection.findUserByEmail(value);
    if (user) {
      throw new Error('E-mail already in use');
    }
  }),
  (req, res) => {
    // Handle the request
  },
);
```

Or maybe you could also verify that the password matches the repeat:

```js
app.post(
  '/create-user',
  body('password').isLength({ min: 5 }),
  body('passwordConfirmation').custom((value, { req }) => {
    return value === req.body.password;
  }),
  (req, res) => {
    // Handle request
  },
);
```

### Implementing a custom sanitizer

Custom sanitizers don't have many rules. Whatever the value that they return, is the value that the field will acquire.

Custom sanitizers can also be asynchronous, so if they return a promise, the promise will be awaited on, and the resolved value is set on the field.

For example, suppose that you'd like to convert an ID from string to the [MongoDB ObjectId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) format:

```js
import { param } from 'express-validator';
import { ObjectId } from 'mongodb';

app.post(
  '/user/:id',
  param('id').customSanitizer(value => ObjectId(value)),
  (req, res) => {
    // req.params.id is an ObjectId now
  },
);
```

:::caution

If you don't return from a custom sanitizer, your field will become `undefined`!

:::

## Error Messages

Whenever a field value is invalid, an error message is recorded for it.<br/>
The default error message is `Invalid value`, which is not descriptive at all of what the error is,
so you might need to customize it. There are a few ways to do that:

### Validator-level message

A validator-level message applies only when the field fails a specific validator.
This can be done by using the [`.withMessage()` method](../api/validation-chain.md#withmessage):

```ts
body('email').isEmail().withMessage('Not a valid e-mail address');
```

### Custom validator-level message

If a custom validator throws, the thrown value will be used as its error message.

```ts
body('email')
  .isEmail()
  .custom(async value => {
    const existingUser = await Users.findByEmail(value);
    if (existingUser) {
      // Will use the below as the error message
      throw new Error('A user already exists with this e-mail address');
    }
  });
```

:::note

Specifying a message using `.withMessage()` will have precedence over the thrown value from the
custom validator.

:::

### Field-level message

A field-level message is set when you create the validation chain. It's used as a fallback message
when a validator doesn't override its error message.

```ts
body('json_string', 'Invalid json_string')
  // No message specified for isJSON, so use the default "Invalid json_string"
  .isJSON()
  .isLength({ max: 100 })
  // Overrides the default message when `isLength` fails
  .withMessage('Max length is 100 bytes');
```

### Other error messages

Some express-vaildator functions might create a different error type, and they offer a different way
to specify an error message:

- [`checkExact()`](../api/check-exact.md)
- [`oneOf()`](../api/one-of.md)

## The `ExpressValidator` class

A useful way to reuse certain customizations is to use the `ExpressValidator` class.

It contains all the functions that you can import directly from express-validator:
`body`, `matchedData`, `oneOf`, `validationResult`, etc, but with customizations that you specify when
instantiating it.<br/>
For example, [custom validators, sanitizers](#custom-validators-and-sanitizers), or
[error formatter](../api/validation-result.md#errorformatter).

```ts
import { ExpressValidator } from 'express-validator';

const { body, validationResult } = new ExpressValidator(
  {
    isPostID: async value => {
      // Verify if the value matches the post ID format
    },
  },
  {
    muteOffensiveWords: value => {
      // Replace offensive words with ***
    },
  },
);

app.post(
  '/forum/:post/comment',
  param('post').isPostID(),
  body('comment').muteOffensiveWords(),
  (req, res) => {
    const result = validationResult(req);
    // Handle new post validation result
  },
);
```

:::tip

You can check out the [full API of `ExpressValidator`](../api/express-validator.md).

:::

### Typescript support

A couple of custom types can be created matching exactly the type of your `ExpressValidator` instance.

```ts
import { ExpressValidator, CustomValidationChain, CustomSchema } from 'express-validator';

const myExpressValidator = new ExpressValidator({ isEmailNotInUse });
const { body, checkSchema } = myExpressValidator;

type MyValidationChain = CustomValidationChain<typeof myExpressValidator>;
type MySchema = CustomSchema<typeof myExpressValidator>;

const createEmailChain = (): MyValidationChain => body('email').isEmail().isEmailNotInUse();
const signupSchema: MySchema = {
  email: {
    isEmail: true,
    isEmailNotInUse: true,
  },
};
```
