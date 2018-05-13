---
id: whole-body-validation
title: Whole Body Validation
---

Sometimes you need to validate requests whose body is a string, an array, or even a number!
That's why you can omit the field to validate and check `req.body` directly:

```js
const { body } = require('express-validator/check');
app.post('/recover-password', body().isEmail(), (req, res) => {
  // Assume the validity was already checked
  User.recoverPassword(req.body).then(() => {
    res.send('Password recovered!');
  });
});
```
