---
title: Field Selection
---

In express-validator, a field is any value that is either validated or sanitized.  
It can be a simple value such as a string or a number, to a more complex array or object value.

Pretty much every function or value returned by express-validator reference fields in some way.
For this reason, it's important to understand the field path syntax both for when selecting fields
for validation, and when accessing the validation errors or validated data.

## Syntax

The path of a field is always a string, which resembles how you'd reference it with pure JavaScript.

- Each word-like sequence of characters is a **segment**. Segments are like properties of a JavaScript object.
- Fields nested under objects can be selected by separating two segments with a `.`
- Array indices can be selected by wrapping them in square brackets
- Segments with special characters such as `.` can be selected by wrapping in square brackets and double quotes

For example, suppose that `req.body` looks like the following:

```json
{
  "name": "John McExpress",
  "addresses": {
    "work": {
      "country": "express-validator land"
    }
  },
  "siblings": [{ "name": "Maria von Validator" }],
  "websites": {
    "www.example.com": { "dns": "1.2.3.4" }
  }
}
```

The following table represents what each path would select in the above object:

| Path                          | Selected value                        |
| ----------------------------- | ------------------------------------- |
| `name`                        | `"John McExpress"`                    |
| `addresses.work.country`      | `"express-validator land"`            |
| `siblings`                    | `[{ "name": "Maria von Validator" }]` |
| `siblings[0]`                 | `{ "name": "Maria von Validator" }`   |
| `siblings[0].name`            | `"Maria von Validator"`               |
| `siblings.name`               | `undefined`                           |
| `websites["www.example.com"]` | `{ "dns": "1.2.3.4" }`                |
| `websites.www.example.com`    | `undefined`                           |

## Whole-body selection

Sometimes a request's body is not an object or an array, but you still want to select it
for validation/sanitization.

This can be done by omitting the field path, or by using an empty string. Both yield the same result:

```js
app.post(
  '/recover-password',
  // These are equivalent.
  body().isEmail(),
  body('').isEmail(),
  (req, res) => {
    // Handle request
  },
);
```

:::note

It's possible to select the whole `req.cookies`, `req.params` and etc too, though it's probably
not as useful or common as it'd be with `req.body`.

:::

## Advanced features

### Wildcards

Sometimes you will want to apply the same rules to all items of an array, or all keys of an object.
That's what the `*`, also known as the wildcard, is for.  
The wildcard can be used in place of any segment, which will correctly select all indices of the
array or keys of the object it's located in.

Each matched field is returned as a different instance; that is, it's validated or sanitized
independently from the others.  
If the array or object that the wildcard is placed in is empty, then nothing is validated.

Let's imagine that the endpoint for updating a user's profile accepts their addresses and siblings:

```json
{
  "addresses": {
    "home": { "number": 35 },
    "work": { "number": 501 }
  },
  "siblings": [{ "name": "Maria von Validator" }, { "name": "Checky McCheckFace" }]
}
```

In order to validate that the address numbers are all integers, and that the name of the siblings
are set, you could have the following validation chains:

```js
app.post(
  '/update-user',
  body('addresses.*.number').isInt(),
  body('siblings.*.name').notEmpty(),
  (req, res) => {
    // Handle request
  },
);
```

### Globstars

Globstars extend [wildcards](#wildcards) to an infinitely deep level.  
They can be used when you have an unknown level of nested fields, and want to validate/sanitize all
them the same way.

For example, imagine that your endpoint handles the update of a company's organizational chart.  
The structure is recursive, so it looks roughly like this:

```json
{
  "name": "Team name",
  "teams": [{ "name": "Subteam name", "teams": [] }]
}
```

In this scenario, a team is inside another team that is inside another team, and so on.

You can use a globstar (`**`) to target any field, no matter how deep it is in the request.  
The following example checks that all fields called `name`, including the one at the root of the `req.body`, are set:

```js
app.put('/update-chart', body('**.name').notEmpty(), (req, res) => {
  // Handle request
});
```
