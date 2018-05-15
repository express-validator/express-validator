---
id: version-5.2.0-whole-body-validation
title: Whole Body Validation
original_id: whole-body-validation
---

Sometimes you need to validate requests whose body is a string, an array, or even a number!
That's why you can omit the field to validate and check `req.body` directly:

```js
const bodyParser = require('body-parser');
const express = require('express');
const { body } = require('express-validator/check');

const app = express();

// Will handle text/plain requests
app.use(bodyParser.text());

app.post('/recover-password', body().isEmail(), (req, res) => {
  // Assume the validity of the request was already checked
  User.recoverPassword(req.body).then(() => {
    res.send('Password recovered!');
  });
});
```

This setup should be able to handle the following request:

```http
POST /recover-password HTTP/1.1
Host: localhost:3000
Content-Type: text/plain

my@email.com
```