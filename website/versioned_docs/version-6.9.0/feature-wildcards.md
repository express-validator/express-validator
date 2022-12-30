---
id: wildcards
title: Wildcards
---

Sometimes you will want to apply the same rules to all items of an array or all keys of some object.  
That's what the `*` character -- also known as a wildcard -- is for.

For example, imagine you want to validate that all addresses have a valid postal code,
and that the number of each address is sanitized as an integer.

We can do this with the following code:

```js
const express = require('express');
const { check, sanitize } = require('express-validator');

const app = express();
app.use(express.json());

app.post(
  '/addresses',
  check('addresses.*.postalCode').isPostalCode(),
  sanitize('addresses.*.number').toInt(),
  (req, res) => {
    // Handle the request
  },
);
```

This will handle cases where you send an array of addresses:

```json
{
  "addresses": [
    { "postalCode": "2010", "number": "500" },
    { "postalCode": "", "number": "501" }
  ]
}
```

...or even cases where you want a predefined set of addresses:

```json
{
  "addresses": {
    "home": { "postalCode": "", "number": "501" },
    "work": { "postalCode": "2010", "number": "500" }
  }
}
```
