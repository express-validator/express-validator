---
title: matchedData
---

# `matchedData()`

## `matchedData()` {#matcheddata}

```ts
import { matchedData } from 'express-validator';
matchedData(req, options?: {
  includeOptionals?: boolean,
  onlyValidData?: boolean,
  locations?: Location[],
})
```

Extracts data validated and/or sanitized by express-validator from the request, and returns an object
with them.

```ts
app.post(
  '/contact-us',
  [body('email').isEmail(), body('message').notEmpty(), body('phone').optional().isMobilePhone()],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // handle validation errors
      return res.send('Please fix the request');
    }

    const data = matchedData(req);
    // If phone isn't set:
    // => { email: 'foo@bar.com', message: 'Hi hello' }
    // If phone is set:
    // => { email: 'foo@bar.com', message: 'Hi hello', phone: '+1223334444' }
  },
);
```

### With optional data

By default, `matchedData` doesn't return data that is optional and wasn't present in the request.<br/>
You can set `options.includeOptionals` to `true` to change this behavior.

```ts
app.post(
  '/contact-us',
  [body('email').isEmail(), body('message').notEmpty(), body('phone').optional().isMobilePhone()],
  (req, res) => {
    const data = matchedData(req, { includeOptionals: true });
    // If phone isn't set:
    // => { email: 'foo@bar.com', message: 'Hi hello', phone: undefined }
  },
);
```

If you want to return optional values which aren't `undefined` like `null` and `falsy` values,
you can set `options.includeOptionals` to `ignoreUndefined`.

```ts
app.post(
  '/contact-us',
  [
    body('email').isEmail(),
    body('message').notEmpty(),
    body('phone').optional({ values: 'null' }).isMobilePhone(),
  ],
  (req, res) => {
    const data = matchedData(req, { includeOptionals: 'ignoreUndefined' });
    // If phone is set as null:
    // => { email: 'foo@bar.com', message: 'Hi hello', phone: null }
  },
);
```

:::tip

See the [documentation on `.optional()`](./validation-chain.md#optional) to learn more.

:::

### With invalid data

By default, `matchedData` return only data that is valid; that is, if the request contains invalid data,
it's omitted from the result.<br/>
You can set `options.onlyValidData` to `false` to change this behavior.

```ts
app.post('/signup', body('email').isEmail(), body('password').notEmpty(), (req, res) => {
  const data = matchedData(req, { onlyValidData: false });
  // => { email: 'not_actually_an_email', password: '' }
});
```

### Selecting data from specific locations

By default, `matchedData` selects data validated on all of request's locations.
You can change this behavior by setting `options.locations` to a list of the locations which you wish
to select data from:

```ts
app.post(
  '/signup',
  [body('email').isEmail(), body('password').notEmpty(), query('subscribe_newsletter').isBoolean()],
  (req, res) => {
    const data = matchedData(req);
    // => { email: 'foo@bar.com', password: '12345', subscribe_newsletter: true }

    const data2 = matchedData(req, { locations: ['query'] });
    // => { subscribe_newsletter: true }
  },
);
```

### Typescript usage

The `matchedData` function signature accepts passing a [Generic Type](https://www.typescriptlang.org/docs/handbook/2/generics.html) as the return type.

The default type is `Record<string, any>`.

```ts
import { matchedData } from 'express-validator';

app.post(
  '/contact-us',
  [body('email').isEmail(), body('message').notEmpty(), body('phone').optional().isMobilePhone()],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // handle validation errors
      return res.send('Please fix the request');
    }

    const result = matchedData<{
      email: string;
      message: string;
      phone?: string;
    }>(req);
  },
);
```
