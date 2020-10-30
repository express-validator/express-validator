---
id: migration
title: Migration guide
---
This tutorial guide your through to one way to migrate your earlier version of express-validator to version 6.

## Migration guide version <=5 to 6

Let's suppose we have the following  directory and folder structure:
```
...
+-- server
|   +-- index.js
+-- app.js
+-- package.json
```
In previous versions of express-validator there were a recommendation that you import the `express-validator` module, right after body-parser middleware in your express module.
*app.js*
```js
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const app = express();

app.use(bodyParser.urlencoded({ extended: true
}));
app.use(expressValidator());

app.use(require('./server/index'));
.
.
.
module.exports = app;
```
In `server/index.js` we have the declaration of our routes that contains the express-validators middleware to handle validation.
*server/index.js*
```js
const express = require('express');
const router = express.Router();

app.post('/user', handleValidation, (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});

handleValidation = (req, res, next) => {
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return  res.status(400).json({ errors:  result.array() });
    }
    next();
  });
};
module.exports = router;
```
Now in new version >=6 there you should remove the declaration from your app.js (root express module).
And declare that in your route handling route directly.
*app.js*
```js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true
}));

app.use(require('./server/index'));
.
.
.
module.exports = app;
```
Now in our root handler we should import `express-validator` module (line 3).
*server/index.js*
```js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); //<--import that

app.post('/user', validationRules, checkRules, (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});
//use check (imported in line 3)
//it is an array!
validationRules = [
  check('login', 'login is required').exists(),
  check('password', 'password is required').exists(),
  check('login', 'login is required').notEmpty(),
  check('password', 'password is required').notEmpty()
];
//use validationResult (imported line 3)
//function to stop middleware chaining
checkRules = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
module.exports = router;
```
If you use validators for **body**, **params** or **query** you must import the ones you need in your validator. You can see more examples in current version >= 6 documentation.
Now you have a project ready for working with version 6.
After you migrate all your rules you are ready to go with express-validator version >= 6.

