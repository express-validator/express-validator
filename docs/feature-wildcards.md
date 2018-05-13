---
id: wildcards
title: Wildcards
---

To validate or sanitize nested object properties or an array of strings use wildcards (`*`).

```js
// Validate the postal code of each address, making sure the value is in postal code format 
check('addresses.*.postalCode').isPostalCode(),

// Sanitize the number of each address, making it arrive as an integer
sanitize('addresses.*.number').toInt()
```