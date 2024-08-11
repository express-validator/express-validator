---
title: oneOf
---

import { SideBySideExample, UsageExample, ErrorExample } from '@site/components/example';

# `oneOf()`

## `oneOf()`

```ts
oneOf(
  chains: (ValidationChain | ValidationChain[])[],
  options?: { message?: any, errorType?: 'grouped' | 'least_errored' | 'flat' }
): Middleware & ContextRunner
```

Creates a middleware to ensure that at least one of the given validation chain groups are valid.

If none of the validation chain groups are valid, a validation error is added to the request.
The error that is added depends on the `errorType` option, though; check out [error types](#error-types)
to understand how it works.

### Example: List of validation chains

`oneOf()` can take a list of validation chains.
In the following example, if either the e-mail or the phone number pass validation but the other one
doesn't, there won't be validation errors:

```ts
import { body, oneOf } from 'express-validator';

app.post(
  '/contact-us',
  body('message').notEmpty(),
  oneOf([body('phone_number').isMobilePhone(), body('email').isEmail()], {
    message: 'At least one valid contact method must be provided',
  }),
  (req, res) => {
    // Handle request
  },
);
```

### Example: Grouped validation chains

It's also possible to have groups of validation chains be validated as a unit.
This is helpful if you have a bunch of fields that work together be a single alternative.

In the following example, all of the credit card fields must pass, otherwise the user needs to provide
a valid Paypal account or an Ethereum wallet to have a payment method in their account:

```ts
import { body, oneOf } from 'express-validator';

app.post(
  '/add-payment-method',
  oneOf(
    [
      body('eth_wallet').isEthereumAddress(),
      body('paypal').isEmail(),
      [
        body('credit_card.number').isCreditCard(),
        body('credit_card.expiry').isDate(),
        body('credit_card.cvv').isNumeric(),
      ],
    ],
    { message: 'At least one valid refund method must be provided' },
  ),
  (req, res) => {
    // Handle request
  },
);
```

## Error types

Following are the possible values for `oneOf()`'s `options.errorType`, and their behavior.
If one is not provided, it defaults to `grouped`.

### `grouped` {#error-type-grouped}

Sets `oneOf()` to add a
[`GroupedAlternativeValidationError` error](./validation-result.md#groupedalternativevalidationerror)
when none of the validation chain groups are valid.  
The error's `nestedErrors` property includes all errors from every validation chain passed to `oneOf()`,
grouped by their respective validation chain groups.

If `options.message` is a function, then it must be a [`GroupedAlternativeMessageFactory`](#groupedalternativemessagefactory).

<SideBySideExample>
<UsageExample>

```ts
oneOf(
  [
    body('phone_number').isMobilePhone(),
    body('email').isEmail(), //
  ],
  {
    errorType: 'grouped',
  },
);
```

</UsageExample>
<ErrorExample>

```json
{
  "type": "alternative_grouped",
  "msg": "Invalid value(s)",
  "nestedErrors": [
    [{ "type": "field", "path": "phone_number" /* etc */ }],
    [{ "type": "field", "path": "email" /* etc */ }]
  ]
}
```

</ErrorExample>
</SideBySideExample>

### `least_errored` {#error-type-least-errored}

Sets `oneOf()` to add a
[`AlternativeValidationError` error](./validation-result.md#groupedalternativevalidationerror)
when none of the validation chain groups are valid.  
The error's `nestedErrors` property includes all errors from the validation chain group that had the
least errors.

If `options.message` is a function, then it must be an [`AlternativeMessageFactory`](#alternativemessagefactory).

<SideBySideExample>
<UsageExample>

```ts
oneOf(
  [
    body('eth_wallet').isEthereumAddress(),
    body('paypal').isEmail(),
    [
      body('credit_card.number').isCreditCard(),
      body('credit_card.expiry').isDate(),
      body('credit_card.cvv').isNumeric(),
    ],
  ],
  { errorType: 'least_errored' },
);
```

</UsageExample>
<ErrorExample>

```json
{
  "type": "alternative",
  "msg": "Invalid value(s)",
  "nestedErrors": [
    {
      "type": "field",
      "path": "eth_wallet" /* etc */
    }
  ]
}
```

</ErrorExample>
</SideBySideExample>

### `flat` {#error-type-flat}

Sets `oneOf()` to add a
[`AlternativeValidationError` error](./validation-result.md#groupedalternativevalidationerror)
when none of the validation chain groups are valid.  
The error's `nestedErrors` property is a list of all errors from every validation chains passed to
`oneOf()`.

If `options.message` is a function, then it must be an [`AlternativeMessageFactory`](#alternativemessagefactory).

<SideBySideExample>
<UsageExample>

```ts
oneOf(
  [
    body('eth_wallet').isEthereumAddress(),
    body('paypal').isEmail(),
    [
      body('credit_card.number').isCreditCard(),
      body('credit_card.expiry').isDate(),
      body('credit_card.cvv').isNumeric(),
    ],
  ],
  { errorType: 'flat' },
);
```

</UsageExample>
<ErrorExample>

```json
{
  "type": "alternative",
  "msg": "Invalid value(s)",
  "nestedErrors": [
    { "type": "field", "path": "eth_wallet" /* etc */ },
    { "type": "field", "path": "paypal" /* etc */ }
    // ...and so on for other fields
  ]
}
```

</ErrorExample>
</SideBySideExample>

## `AlternativeMessageFactory`

```ts
type AlternativeMessageFactory = (
  nestedErrors: FieldValidationError[],
  options: { req: Request },
) => any;
```

The message factory type used when the `oneOf()` error type is [`least_errored`](#error-type-least-errored)
or [`flat`](#error-type-flat).

<SideBySideExample>
<UsageExample>

```ts
oneOf(
  [
    body('phone_number').isMobilePhone(),
    body('email').isEmail(), //
  ],
  {
    errorType: 'flat',
    message: nestedErrors => {
      const count = nestedErrors.length;
      return `There have been ${count} errors`;
    },
  },
);
```

</UsageExample>
<ErrorExample>

```json
{
  "type": "alternative",
  "msg": "There have been 2 errors",
  "nestedErrors": [
    { "type": "field", "path": "phone_number" /* etc */ },
    { "type": "field", "path": "email" /* etc */ }
  ]
}
```

</ErrorExample>
</SideBySideExample>

## `GroupedAlternativeMessageFactory`

```ts
type AlternativeMessageFactory = (
  nestedErrors: FieldValidationError[][],
  options: { req: Request },
) => any;
```

The message factory type used when the `oneOf()` [error type is `grouped`](#error-type-grouped).

<SideBySideExample>
<UsageExample>

```ts
oneOf(
  [
    body('phone_number').isMobilePhone(),
    body('email').isEmail(), //
  ],
  {
    errorType: 'grouped',
    message: nestedErrors => {
      const count = nestedErrors.reduce((total, group) => total + group.length, 0);
      return `There have been ${count} errors`;
    },
  },
);
```

</UsageExample>
<ErrorExample>

```json
{
  "type": "alternative_grouped",
  "msg": "There have been 2 errors",
  "nestedErrors": [
    [{ "type": "field", "path": "phone_number" /* etc */ }],
    [{ "type": "field", "path": "email" /* etc */ }]
  ]
}
```

</ErrorExample>
</SideBySideExample>
