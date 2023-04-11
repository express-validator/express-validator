---
title: ExpressValidator
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `ExpressValidator`

## `ExpressValidator` {#expressvalidator}

```ts
import { ExpressValidator } from 'express-validator';
new ExpressValidator(
  customValidators?: Record<string, CustomValidator>,
  customSanitizers?: Record<string, CustomSanitizer>,
  options?: {
    errorFormatter: ErrorFormatter<E>;
  }
);
```

`ExpressValidator` is a class which wraps the entire express-validator API, with some differences:

1. you can specify custom validators and/or custom sanitizers that are always available in validation chains;
2. you can specify options that apply by default to some functions.

<!-- `ExpressValidator` is a class which wraps the entire express-validator API.<br/>
You can specify custom validators and/or custom sanitizers that are always available in validation
chains, and you can also specify options that apply by default to some functions. -->

`customValidators` and `customSanitizers` are objects from custom validator/sanitizer name to implementation.<br/>
See examples in the [usage section](#usage), and see the ["Custom Validators and Sanitizers" guide](../guides/customizing.md#custom-validators-and-sanitizers)
to learn more.

If `options.errorFormatter` is set, it's used as the default error formatter used by [`.validationResult()`](#validationresult).

### Usage

#### With custom validators only

```ts
const { body } = new ExpressValidator({
  isEmailNotInUse: async value => {
    const user = await Users.findByEmail(value);
    if (user) {
      throw new Error('E-mail already in use');
    }
  },
});

app.post('/signup', body('email').isEmailNotInUse(), (req, res) => {});
```

#### With custom sanitizers only

<!--prettier-ignore-->
```ts
const { body } = new ExpressValidator({}, {
  muteOffensiveWords: async value => {
    for (const word of offensiveWords) {
      value = value.replaceAll(new RegExp(`\\b${word}\\b`), word[0].padEnd(word.length, '*'));
    }
    return value;
  },
});

app.post('/add-comment', body('comment').muteOffensiveWords(), (req, res) => {});
```

### `.check()`

```ts
check(fields?: string | string[], message?: any): CustomValidationChain<T>
```

Same as [standalone `check()` function](./check.md#check), but returning a
[`CustomValidationChain`](#customvalidationchain) for that `ExpressValidator` instance.

### `.body()`

```ts
body(fields?: string | string[], message?: any): CustomValidationChain<T>
```

Same as [standalone `body()` function](./check.md#body), but returning a
[`CustomValidationChain`](#customvalidationchain) for that `ExpressValidator` instance.

### `.cookie()`

```ts
cookie(fields?: string | string[], message?: any): CustomValidationChain<T>
```

Same as [standalone `cookie()` function](./check.md#cookie), but returning a
[`CustomValidationChain`](#customvalidationchain) for that `ExpressValidator` instance.

### `.header()`

```ts
header(fields?: string | string[], message?: any): CustomValidationChain<T>
```

Same as [standalone `header()` function](./check.md#header), but returning a
[`CustomValidationChain`](#customvalidationchain) for that `ExpressValidator` instance.

### `.param()`

```ts
param(fields?: string | string[], message?: any): CustomValidationChain<T>
```

Same as [standalone `check()` function](./check.md#check), but returning a
[`CustomValidationChain`](#customvalidationchain) for that `ExpressValidator` instance.

### `.query()`

```ts
query(fields?: string | string[], message?: any): CustomValidationChain<T>
```

Same as [standalone `query()` function](./check.md#query), but returning a
[`CustomValidationChain`](#customvalidationchain) for that `ExpressValidator` instance.

### `.buildCheckFunction()`

### `.checkExact()`

Same as [standalone `checkExact()` function](./check-exact.md#checkexact).
Only present in `ExpressValidator` for convenience.

### `.checkSchema()`

```ts
checkSchema(schema: CustomSchema<T>, defaultLocations?: Location[]): CustomValidationChain<T>[]
```

Same as [standalone `checkSchema()` function](./check-schema.md#checkschema), but the schema can reference
the custom validators or sanitizers from the `ExpressValidator` instance.

```ts
const { checkSchema } = new ExpressValidator({ isEmailNotInUse });
app.post(
  '/signup',
  checkSchema({
    email: { isEmailNotInUse: true },
  }),
  (req, res) => {
    // handle request
  },
);
```

### `.matchedData()`

Same as [standalone `matchedData()` function](./matched-data.md).
Only present in `ExpressValidator` for convenience.

### `.oneOf()`

Same as [standalone `oneOf()` function](./one-of.md), but accepts [`CustomValidationChain`s](#customvalidationchain)
created from `ExpressValidator`.

### `.validationResult()`

```ts
validationResult(req): Result<E>
```

Same as [standalone `validationResult()` function](./validation-result.md#validationresult),
but uses the `options.errorFormatter` passed in the constructor by default.

<Tabs groupId="lang">
<TabItem value="js" label="JavaScript">

<!--prettier-ignore-->
```js
const { ExpressValidator } = require('express-validator');

const { query, validationResult } = new ExpressValidator({}, {}, {
  errorFormatter: error => error.msg,
};

app.post('/hello', query('person').notEmpty(), (req, res) => {
  const result = validationResult(req);
  const errors = result.array();
  // => ['Invalid value', ... ]

  const result2 = result.formatWith(error => `${error.msg}!!!`);
  const errors2 = result2.array();
  // => ['Invalid value!!!']
});
```

</TabItem>
<TabItem value="ts" label="TypeScript">

<!--prettier-ignore-->
```ts
import { Result, ExpressValidator } from 'express-validator';

const { query, validationResult } = new ExpressValidator({}, {}, {
  errorFormatter: error => error.msg as string,
};

app.post('/hello', query('person').notEmpty(), (req, res) => {
  const result: Result<string> = validationResult(req);
  const errors = result.array();
  // => ['Invalid value', ... ]

  const result2: Result<string> = result.formatWith(error => `${error.msg}!!!`);
  const errors2 = result2.array();
  // => ['Invalid value!!!']
});
```

</TabItem>
</Tabs>

## `CustomSchema`

The type of a schema created through `ExpressValidator`.

Has a single generic parameter `T`, which is the type of the `ExpressValidator` instance.

```ts
import { ExpressValidator, CustomSchema } from 'express-validator';

const myExpressValidator = new ExpressValidator({ isEmailNotInUse });
type MyCustomSchema = CustomSchema<typeof myExpressValidator>;

const schema: MyCustomSchema = {
  email: { isEmailNotInUse: true },
};
```

## `CustomValidationChain`

The type of a validation chain created through `ExpressValidator`.

Has a single generic parameter `T`, which is the type of the `ExpressValidator` instance.

```ts
import { ExpressValidator, CustomValidationChain } from 'express-validator';

const myExpressValidator = new ExpressValidator({ isEmailNotInUse });
type MyValidationChain = CustomValidationChain<typeof myExpressValidator>;

const chain: MyValidationChain = myExpressValidator.body('email').isEmailNotInUse();
```
