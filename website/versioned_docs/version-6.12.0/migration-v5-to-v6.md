---
id: migration-v5-to-v6
title: Migration from v5 to v6
---

Starting with v6, the approach for doing validations is more declarative and, in turn, some of the APIs we had in v5 require some changes.

The purpose of this documentation is to show how to migrate your existing express-validator code from v5 to v6 through sample codes. With the understanding that there is a more declarative way of doing the validations in v6+, the only requirement in the sample codes we set for is to keep the similar programmatical approach in both versions, so that we are comparing apples to apples.

> **For a complete list of breaking changes and new features in 6.0.0**,
> please check [its release notes](https://github.com/express-validator/express-validator/releases/tag/v6.0.0).

## Sample code using v5.3.1

Say we want to leverage this library in a more _programmatic_ way: A POST request handler takes a JSON object in the request's body and responds based on if the **_greetings_** attribute is found in the JSON object.

```js
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.post('/', (req, res) => {
  console.info(`checking request body: ${JSON.stringify(req.body)}`);
  req.checkBody('greetings').isLength({ min: 1 });

  const validationResults = req.validationErrors();
  console.info(`validation results: ${JSON.stringify(validationResults)}`);

  if (!validationResults || validationResults.length < 1) {
    req.sanitizeBody('greetings').escape().trim();
    res.send(`checking done, hello: ${req.body['greetings']}`);
  } else {
    res.send(`checking done, error: ${JSON.stringify(validationResults)}`);
  }
});

app.listen(3000, () => {
  console.info('app listening at port 3000');
});
```

For example, we want to make our v5 code to use the [`check`](https://github.com/express-validator/express-validator/blob/master/docs/api-check.md) and [`validationResult`](https://github.com/express-validator/express-validator/blob/master/docs/api-validation-result.md) functions in v6

1. Change from
   `const expressValidator = require('express-validator')` to
   `const {check, validationResult} = require('express-validator')`
2. Remove `app.use(expressValidator())`
3. Change from
   `req.checkBody('greetings').isLength({min: 1})` to
   `await check('greetings').notEmpty().run(req)`
4. Change from
   `const validationResults = req.validationErrors()` to
   `const validationResults = validationResult(req)`
5. Change from
   `req.sanitizeBody('greetings').escape().trim()` to
   `await check('greetings').trim().escape().run(req)`

## Sample code using v6+

```js
const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', async (req, res) => {
  console.info(`checking request body: ${JSON.stringify(req.body)}`);
  await check('greetings').notEmpty().run(req);

  const validationResults = validationResult(req);
  console.info(
    `validation results: ${JSON.stringify(
      validationResults,
    )}, is empty? ${validationResults.isEmpty()}`,
  );

  if (validationResults.isEmpty()) {
    await check('greetings').trim().escape().run(req);
    res.send(`checking done, hello: ${req.body['greetings']}`);
  } else {
    res.send(`checking done, error: ${JSON.stringify(validationResults.array())}`);
  }
});

app.listen(3000, () => {
  console.info('app listening at port 3000');
});
```

> The complete diff between the two versions of the example: https://github.com/shwei/express-validator-migrate-5-to-6/blob/main/v5_to_v6.diff

> To see the sample codes in action I created the project [express-validator-migrate-5-to-6](https://github.com/shwei/express-validator-migrate-5-to-6).
