---
id: validation-result-api
title: validationResult()
---

These methods are all available via `require('express-validator')`.

## `validationResult(req)`
- `req`: the express request object
> *Returns:* a [`Result`](#result) object

Extracts the validation errors from a request and makes them available in a [`Result`](#result) object.

Each error returned by [`.array()`](#array-options) and [`.mapped()`](#mapped) methods
have the following format _by default_:

```js
{
  "msg": "The error message",
  "param": "param.name.with.index[0]",
  "value": "param value",
  // Location of the param that generated this error.
  // It's either body, query, params, cookies or headers.
  "location": "body",

  // nestedErrors only exist when using the oneOf function
  "nestedErrors": [{ ... }]
}
```


### `.withDefaults(options)`
- `options` *(optional)*: an object of options. Defaults to `{ formatter: error => error }`
> *Returns:* a new [`validationResult`](#validationresultreq) function, using the provided options

Creates a new `validationResult()`-like function with default options passed to the generated
[`Result`](#result) instance.

Below is an example which sets a default error formatter:

```js
const { validationResult } = require('express-validator');

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return {
      myLocation: error.location,
    };
  }
});

app.post('/create-user', yourValidationChains, (req, res) => {
  // errors will be like [{ myLocation: 'body' }, { myLocation: 'query' }], etc
  const errors = myValidationResult(req).array();
});
```

## `Result`
An object that holds the current state of validation errors in a request and allows access to it in
a variety of ways.

### `.isEmpty()`
> *Returns:* a boolean indicating whether this result object contains no errors at all.

```js
app.post('/create-user', yourValidationChains, (req, res) => {
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();
  // do something if hasErrors is true
});
```

### `.formatWith(formatter)`
- `formatter(error)`: the function to use to format when returning errors.  
  The `error` argument is an object in the format of `{ location, msg, param, value, nestedErrors }`, as described above.
> *Returns:* a new `Result` instance

```js
app.post('/create-user', yourValidationChains, (req, res, next) => {
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
  };
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    // Response will contain something like
    // { errors: [ "body[password]: must be at least 10 chars long" ] }
    return res.json({ errors: result.array() });
  }

  // Handle your request as if no errors happened
});
```

### `.array([options])`
- `options` *(optional)*: an object of options. Defaults to `{ onlyFirstError: false }`
> *Returns:* an array of validation errors.

Gets all validation errors contained in this result object.

If the option `onlyFirstError` is set to `true`, then only the first
error for each field will be included.

### `.mapped()`
> *Returns:* an object where the keys are the field names, and the values are the validation errors

Gets the first validation error of each failed field in the form of an object.

### `.throw()`
If this result object has errors, then this method will throw an exception
decorated with the same validation result API.

```js
try {
  validationResult(req).throw();
  // Oh look at ma' success! All validations passed!
} catch (err) {
  console.log(err.mapped()); // Oh noes!
}
```
