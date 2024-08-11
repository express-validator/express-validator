---
title: Migration from v5 to v6
toc_max_heading_level: 4
---

The migration process from express-validator v5.x.x to v6.x.x is manual.
You'll need to follow these steps after you've upgraded the package on your project.

## Support

Node 6 is no longer supported. You'll need to upgrade to Node 8 or newer.

## From legacy to check API

:::info

These steps are only necessary if your project has been using the
[legacy express-validator API](../version-5.3.0/api-legacy.md).

If you are already using the [check APIs](./api/check.md), then you shouldn't need to do anything
under this section.

:::

### express.js application set up

express-validator is no longer a single middleware that you add to the request.
You'll need to remove the `app.use(expressValidator())` line(s) from your express.js application set up.

:::note

If your application passes options to `expressValidator()`, please read about
[custom validators/sanitizers](#custom-validatorssanitizers) and [validation errors](#validation-errors).

:::

### Route handlers

#### Validations/sanitizations chains

It's necessary to make a couple of changes to how the validations/sanitizations are written.

You'll need to replace the following snippets all around your codebase:

| From                                                           | To                            |
| -------------------------------------------------------------- | ----------------------------- |
| `req.check(field)`, `req.assert(field)`, `req.validate(field)` | `await check(field)`          |
| `req.checkBody(field)`                                         | `await body(field)`           |
| `req.checkCookies(field)`                                      | `await cookie(field)`         |
| `req.checkHeaders(field)`                                      | `await header(field)`         |
| `req.checkParams(field)`                                       | `await param(field)`          |
| `req.checkQuery(field)`                                        | `await query(field)`          |
| `req.sanitize(field)`, `req.filter(field)`                     | `await sanitize(field)`       |
| `req.sanitizeBody(field)`                                      | `await sanitizeBody(field)`   |
| `req.sanitizeCookies(field)`                                   | `await sanitizeCookie(field)` |
| `req.sanitizeHeaders(field)`                                   | `await sanitizeHeader(field)` |
| `req.sanitizeParams(field)`                                    | `await sanitizeParam(field)`  |
| `req.sanitizeQuery(field)`                                     | `await sanitizeQuery(field)`  |

Additionally, you'll also have to append `.run(req)` to the end of those chains.

Example:

```diff
+ const { body, sanitizeBody } = require('express-validator');

app.post('/contact-us', (req, res) => {
- req.checkBody('email').isEmail();
+ await body('email').isEmail().run(req);

- req.sanitizeBody('message')
+ await sanitizeBody('message')
  .escape()
- .trim();
+ .trim()
+ .run(req);
});
```

#### Custom validators/sanitizers

Custom validators and sanitizers are no longer defined in the base express-validator middleware,
which used to make them available to every validation chain.

You'll need to wrap their definition in each chain in `.custom()` or `.customSanitizer()`:

```diff
- const expressValidator = require('express-validator');
+ const { body, sanitize } = require('express-validator');

const isEmailNotInUse = async value => { /* check if email is not taken by other user */ };
const muteOffensiveWords = value => { /* replace offensive words with *** */ };

- app.use(expressValidator({
-  customValidators: { isEmailNotInUse },
-  customSanitizers: { muteOffensiveWords }
- }));

app.use('/sign-up', (req, res) => {
- req.checkBody('email').isEmailNotInUse();
+ await body('email').custom(isEmailNotInUse).run(req);
});

app.use('/contact-us', (req, res) => {
- req.sanitize('message').muteOffensiveWords();
+ await sanitize('message').customSanitizer(muteOffensiveWords).run(req);
});
```

#### Validation errors

You'll need to replace the following snippets in your codebase:

| From                                                                  | To                               |
| --------------------------------------------------------------------- | -------------------------------- |
| `req.validationErrors()`, `await req.asyncValidationErrors()`         | `validationResult(req).array()`  |
| `req.validationErrors(true)`, `await req.asyncValidationErrors(true)` | `validationResult(req).mapped()` |
| `req.getValidationResult()`                                           | `validationResult(req)`          |

If your express-validator middleware used to define an `errorFormatter` option, you can create a custom
`validationResult` function that defines it:

```diff
- const expressValidator = require('express-validator');
+ const { body, validationResult } = require('express-validator');

const errorFormatter = (param, msg, value) => { /* return something */ };

- app.use(expressValidator({
-  errorFormatter
- }));
+ const myValidationResult = validationResult.withDefaults({ formatter: errorFormatter });

app.use('/sign-up', (req, res) => {
- req.checkBody('email').isEmailNotInUse();
+ await body('email').custom(isEmailNotInUse).run(req);

- const errors = req.validationErrors();
+ const errors = myValidationResult(req).array();
});
```

## Deprecations

Importing from `express-validator/check` and `express-validator/filter` is now deprecated,
and will log a warning message to your application's console.

You should now be able to simply import everything from `express-validator`.

## Other breaking changes

Please check [express-validator v6.0.0 release notes](https://github.com/express-validator/express-validator/releases/tag/v6.0.0)
to learn about other breaking changes.
