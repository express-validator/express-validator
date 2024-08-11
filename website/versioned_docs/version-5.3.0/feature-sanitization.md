---
id: sanitization
title: Sanitization
---

Sometimes, receiving input in a HTTP request isn't only about making sure that
the data is in the right format, but also that **it is free of noise**.

[validator.js provides a handful of sanitizers](https://github.com/chriso/validator.js#sanitizers)
that can be used to take care of the data that comes in.

```js
const express = require('express');
const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const app = express();
app.use(express.json());

app.post('/comment', [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('text')
    .not().isEmpty()
    .trim()
    .escape(),
  sanitizeBody('notifyOnReply').toBoolean()
], (req, res) => {
  // Handle the request somehow
});
```

In the example above, we are validating `email` and `text` fields,
so we may take advantage of the same chain to apply some sanitization,
like e-mail normalization and trimming/HTML escaping.  
And because the `notifyOnReply` field isn't validated, we may use `sanitizeBody` function
from the [filter API](api-filter.md) to convert it to a JavaScript boolean.

> **Important:** please note that sanitization mutates the request.
This means that if `req.body.text` was sent with the value `   Hello world :>)`, after the sanitization
its value will be `Hello world :&gt;)`.