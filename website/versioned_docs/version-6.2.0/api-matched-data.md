---
id: matched-data-api
title: matchedData()
---

These methods are all available via `require('express-validator')`.

## `matchedData(req[, options])`
- `req`: the express request object.
- `options` *(optional)*: an object which accepts the following options:
  - `includeOptionals`: if set to `true`, the returned value includes optional data. Defaults to `false`.
  - `onlyValidData`: if set to `false`, the returned value includes data from fields
    that didn't pass their validations. Defaults to `true`.
  - `locations`: an array of locations to extract the data from. The acceptable values include
    `body`, `cookies`, `headers`, `params` and `query`. Defaults to `undefined`, which means all locations.
> *Returns:* an object of data that express-validator has validated or sanitized.

Extracts data validated or sanitized by express-validator from the request and builds
an object with them. Nested paths and wildcards are properly handled as well.  
See examples below.

## Examples
### Gathering data from multiple locations
If data you validated or sanitized is spread across various request locations
(e.g. `req.body`, `req.query`, `req.params`, etc), then `matchedData` will gather it properly.
You can also customize which locations you want the data from.

```js
// Suppose the request looks like this:
// req.query = { from: '2017-01-12' }
// req.body = { to: '2017-31-12' }

app.post('/room-availability', check(['from', 'to']).isISO8601(), (req, res, next) => {
  const queryData = matchedData(req, { locations: ['query'] });
  const bodyData = matchedData(req, { locations: ['body'] });
  const allData = matchedData(req);
  console.log(queryData); // { from: '2017-01-12' }
  console.log(bodyData);  // { to: '2017-31-12' }
  console.log(allData);   // { from: '2017-01-12', to: '2017-31-12' }
});
```

### Including optional data
You may want to have [optional values](api-validation-chain.md#optionaloptions) among the required ones.

If they are not included, some databases might understand that you don't to update that value,
so it's useful to set them to `null` or an empty string.

```js
// Suppose the request looks like this:
// req.body = { name: 'John Doe', bio: '' }

app.post('/update-user', [
  check('name').not().isEmpty(),
  check('bio').optional({ checkFalsy: true }).escape(),
], (req, res, next) => {
  const requiredData = matchedData(req, { includeOptionals: false });
  const allData = matchedData(req, { includeOptionals: true });
  console.log(requiredData);  // { name: 'John Doe' }
  console.log(allData);       // { name: 'John Doe', bio: '' }
});
```