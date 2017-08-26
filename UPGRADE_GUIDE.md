# Version 3 to Version 4 Upgrade Guide
Version 4 came with lots of hotness, but as a major version, this usually implies
some breaking changes were made and therefore your app may not work properly as it used to.

**Don't worry, most of the version 2/3 APIs are still here**.  
We haven't really removed anything, we only added new APIs that are easier to use and extend in the future.  
You don't need to migrate to the new APIs if you don't want to, although we recommend you to do so as soon as possible.

## Breaking changes
### Node v6+ support only
Node v0.10+, previously supported by express-validator v3, is no longer supported.  
You must update to Node v6 or newer in order to use express-validator v4+.

### Bluebird is no longer a dependency
In case your code relied on Bluebird promise extensions, you should migrate them to plain JS promises,  
as this is the used implementation now.

### Validators execution time
Previously, validators were run in an eager manner.  
This meant that the following would run the validations right away:

```js
req.check('email').isEmail();
```

In v4+, the validators are lazily run in the legacy API.  
You must call one of the methods to retrieve the validation errors in order for them to execute:

- `req.validationErrors()`
- `req.asyncValidationErrors()`
- `req.getValidationResult()`

### Usage of `req.validationErrors(true)`/`req.asyncValidationErrors(true)`
Previously in v3-, mapped validation errors (the result of invoking `req.validationErrors(true)`/`req.asyncValidationErrors(true)`)
would return an object with the *last* error for each invalid field.

The new behaviour is to always return the *first* error.

### Validation Result API changes
The validation result API (the object that `req.getValidationResult()` returns after its promise resolves)
no longer provides a method called `.useFirstErrorOnly()`.  

Usages of `.mapped()` will always return only the first error, and usages of `.array()` may be configured
to return only the first error for each field by passing `{ firstErrorOnly: true }` as an argument.