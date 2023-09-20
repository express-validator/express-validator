---
title: Miscellaneous
---

## `buildCheckFunction()`

```ts
import { buildCheckFunction } from 'express-validator';
buildCheckFunction(locations: Location[]): (
  fields?: string | string[],
  message?: FieldMessageFactory | ErrorMessage,
) => ValidationChain
```

Creates a variant of the [`check()` function](./check.md) that checks only the given [request locations](#location).

```ts
const bodyOrQuery = buildCheckFunction(['body', 'query']);
app.put(
  '/update-product',
  // id must be either in req.body or req.query, and must be an UUID
  bodyOrQuery('id').isUUID(),
  productUpdateHandler,
);
```

## TypeScript types

### `ContextRunner`

```ts
interface ContextRunner {
  run(req: Request, options?: { dryRun: boolean }): Promise<Result>;
}
```

Interface implemented by all middlewares which run some sort of validation/sanitization.

Returns a promise for a [`Result`](./validation-result.md#result) exclusive to that validation
chain/middleware.

```ts
import { check } from 'express-validator';
app.post('/recover-password', (req, res) => {
  const result = await check('username').notEmpty().run(req);
  if (!result.isEmpty()) {
    return res.send('Something is wrong with the username.');
  }
});
```

By default, the validation and sanitization results are persisted back into `req`, which means that

- calling `validationResult(req)` will include the results for this validation
- a sanitized field wil be updated on the request, such as `body('message').trim()` will update `req.body.message`.

This behavior can be changed by setting `options.dryRun` to `true`, which will simply run the validations
and return the result.

```ts
import { check } from 'express-validator';
app.post('/login', (req, res) => {
  const usernameResult = await check('username').notEmpty().run(req, { dryRun: true });
  const passwordResult = await check('password').notEmpty().run(req, { dryRun: false });
  const result = validationResult(req);
  // `result` won't include errors from `usernameResult`,
  // but will include those from `passwordResult`
});
```

### `Location`

```ts
type Location = 'body' | 'cookies' | 'headers' | 'params' | 'query';
```

Represents one of the request locations: `req.body`, `req.cookies`, `req.headers`, `req.params` and
`req.query`.

### `matchedData`

The [`matchedData`](./matched-data.md) function signature accepts passing a [Generic Type](https://www.typescriptlang.org/docs/handbook/2/generics.html) as the return type.

The default type is `Record<string, any>`.

```ts
import { matchedData } from 'express-validator';

app.post(
  '/contact-us',
  [
    body('email').isEmail(),
    body('message').notEmpty(),
    body('phone').optional().isMobilePhone()
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // handle validation errors
      return res.send('Please fix the request');
    }

    const result = matchedData<{
      email: string,
      message: string, 
      phone?: string,
    }>(req);
  },
);
```
