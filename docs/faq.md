---
id: faq
title: FAQ
---

## Why arrays are not validated/sanitized correctly?

When using [Standard validators](api-validation-chain.md#standard-validators) and [Standard sanitizers](api-sanitization-chain.md#standard-sanitizers) from [validator.js](https://github.com/validatorjs/validator.js) the value is transformed to `string` using this function:

```ts
export function toString(value: any, deep = true): string {
  if (Array.isArray(value) && value.length && deep) {
    return toString(value[0], false);
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (value && typeof value === 'object' && value.toString) {
    if (typeof value.toString !== 'function') {
      return Object.getPrototypeOf(value).toString.call(value);
    }
    return value.toString();
  } else if (value == null || (isNaN(value) && !value.length)) {
    return '';
  }

  return String(value);
}
```

As we can see above, when validating or sanitizing an `array` only the first element of it is processed.

> You can use [wildcards](feature-wildcards.md) to validate/sanitize all the values of the array.

### Example:

```js
// weekdays: ['sunday', 100]
body('weekdays').isString(); // Passes validation
body('weekdays.*').isString(); // Does not pass validation
```

In this example the first chain processes only the first element of the array and the validation erroneously passes.
In the second one, instead, all the elements are validated and the chain correctly returns an error.

### Referenced issues:

> [#791](https://github.com/express-validator/express-validator/issues/791), [#883](https://github.com/express-validator/express-validator/issues/883), [#931](https://github.com/express-validator/express-validator/issues/931)
