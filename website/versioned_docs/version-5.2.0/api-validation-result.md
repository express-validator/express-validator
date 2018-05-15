---
id: version-5.2.0-validation-result-api
title: Validation Result API
original_id: validation-result-api
---

This is an unified API for dealing with errors, both in legacy and check APIs.

Each error returned by `.array()` and `.mapped()` methods have the following format by default:

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

## `.isEmpty()`
> *Returns:* a boolean indicating whether this result object contains no errors at all.

## `.formatWith(formatter)`
- `formatter(error)`: the function to use to format when returning errors.  
  The `error` argument is an object in the format of `{ location, msg, param, value, nestedErrors }`, as described above.
> *Returns:* this validation result instance

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

## `.array([options])`
- `options` *(optional)*: an object of options. Defaults to `{ onlyFirstError: false }`
> *Returns:* an array of validation errors.

Gets all validation errors contained in this result object.

If the option `onlyFirstError` is set to `true`, then only the first
error for each field will be included.

## `.mapped()`
> *Returns:* an object where the keys are the field names, and the values are the validation errors

Gets the first validation error of each failed field in the form of an object.

## `.throw()`
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

## `.withDefaults(options)`
- `options` *(optional)*: an object of options. Defaults to `{ formatter: error => error }`
> *Returns:* a new [`validationResult`](api-check.md#validationresultreq) function is returned, using the provided options

This is useful when you have a consistent set of options you would like to use for all validation results throughout your application.

Below is an example which sets a default error formatter:

```
const { validationResult } = require('express-validator/check');

const result = validationResult.withDefaults({
    formatter: (error) => {
        return {
            myLocation: error.location,
        };
    }
});

module.exports = result;
```