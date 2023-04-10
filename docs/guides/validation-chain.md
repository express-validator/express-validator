---
title: The Validation Chain
---

The validation chain is one of the main concepts in express-validator, therefore it's useful to learn
about it, so that you can use it effectively.

But don't worry: if you've read through the [Getting Started guide](./getting-started.md), you have
already used validation chains without even noticing!

## What are validation chains? {#what}

**Validation chains** are created by [functions such as `body()`, `param()`, `query()`, and so on](../api/check.md).

They have this name because they wrap the value of a field with validations (or sanitizations),
and each of its methods returns itself.<br/>
This pattern is usually called [**method chaining**](https://en.wikipedia.org/wiki/Method_chaining),
hence why the name _validation chain_.

Validation chains not only [have a number of useful methods for defining validations and sanitizations](../api/validation-chain.md),
but they are also _middleware functions_, meaning that they can be passed to any express.js route handler.

This is an example of how validation chains are usually used, and how you can read one:

```ts
app.post(
  '/newsletter',
  // For the `email` field in `req.body`...
  body('email')
    // ...mark the field as optional
    .optional()
    // ...and when it's present, trim its value, then validate it as an email address
    .trim()
    .isEmail(),
  maybeSubscribeToNewsletter,
);
```

## Features

A validation chain has three kinds of methods: validators, sanitizers and modifiers.

**Validators** determine if the value of a request field is valid.
This means checking if the field is in the format that you expect it to be.
For example, if you're building a sign up form, your requirements could be that the username must
be an e-mail address, and that passwords must be at least 8 characters long.

If the value is invalid, an error is recorded for that field using some error message.
This validation error can then be retrieved at a later point in the route handler and returned to the user.

**Sanitizers** transform the field value.
They are useful to remove noise from the value, to cast the value to the right JavaScript type,
and perhaps even to provide some basic line of defense against threats.

Sanitizers persist the updated field value back into the request,
so that it's usable by other express-validator functions, your own route handler code, and even other middlewares.

**Modifiers** define how validation chains behave when they are run.
This might include adding conditions on when they should run, or even which error message a validator should have.

:::tip

You can check out the list of methods by visiting the [`ValidationChain` API](../api/validation-chain.md).

:::

### Standard validators/sanitizers

Most of the functionality exposed by the validation chain actually comes from
[validator.js](https://github.com/validatorjs/validator.js), which is a JavaScript library specialized
in string validation.

This includes _all_ of validator.js validators and sanitizers,
from commonly used `isEmail`, `isLength`, and `trim` to the more niche `isISBN`, `isMultibyte` and
`stripLow`!

These are called **standard validators** and **standard sanitizers** in express-validator.

Because validator.js only works with _strings_, express-validator will always **convert fields with a
standard validator/sanitizer to string first**.<br/>
Non-string values are converted according to the following table:

- `Date` objects will use the return of the [`toISOString()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString);
- `null`, `undefined` and `NaN` are converted to an empty string;
- Objects which implement a custom `toString()` will use the return of that method;
- Other objects will use the [default `toString()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString);
- All other values are converted into string as-is (such as booleans or numbers).

Each of an array's items is **individually** validated/sanitized according to these rules.<br/>
For example, a validation chain `body('ids').isNumber()` would find two errors when `req.body.ids`
is `[5, '33', 'abc', 'def']`.

:::info

Please report bugs in the validators/sanitizers (such as a value that shouldn't be valid but is, or
vice versa) to [validator.js](https://github.com/validatorjs/validator.js).

:::

## Chaining order

The order in which you call methods on a validation chain _usually_ matters.<br/>
They are almost always run in the order that they are specified, therefore you can tell what a validation
chain will do just by reading its definition, from first chained method to last.

Take the following snippet as an example:

```ts
// Validate if search_query is not empty, then trim it
query('search_query').notEmpty().trim();
```

In this case, if the user passes a `search_query` value that is composed of whitespaces only,
it won't be empty, therefore the validation passes.
But since the `.trim()` sanitizer is there, the whitespaces will be removed, and the field will become empty,
so you actually end up with a false positive.

Now, compare it with the below snippet:

```ts
// Trim search_query, then validate if it's not empty
query('search_query').trim().notEmpty();
```

This chain will more sensibly remove whitespaces, _and then_ validate if the value is not empty.

One exception to this rule is [`.optional()`](../api/validation-chain.md#optional):
It can be placed at any point in the chain and it will mark the chain as optional the same way.

## Reusing validation chains {#reusing}

Validation chains are **mutable**.<br/>
This means that calling methods on one will cause the original chain object to be updated,
just like any references to it.

If you wish to reuse the same chain, it's a good idea to return them from functions:

```ts
const createEmailChain = () => body('email').isEmail();
app.post('/login', createEmailChain(), handleLoginRoute);
app.post('/signup', createEmailChain().custom(checkEmailNotInUse), handleSignupRoute);
```

:::danger

Storing chains _and then_ calling methods on them might cause bugs.<br/>
The following shows how the e-mail not in use validation ends up running not only for the sign-up page,
but also for the login page:

```ts
const baseEmailChain = body('email').isEmail();
app.post('/login', baseEmailChain, handleLoginRoute);
app.post('/signup', baseEmailChain.custom(checkEmailNotInUse), handleSignupRoute);
```

:::
