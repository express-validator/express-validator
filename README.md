# express-validator

[![Build Status](https://secure.travis-ci.org/ctavan/express-validator.png)](http://travis-ci.org/ctavan/express-validator)

An [express.js]( https://github.com/visionmedia/express ) middleware for
[node-validator]( https://github.com/chriso/node-validator ).

This is basically a copy of a [gist]( https://gist.github.com/752126 ) by
node-validator author [chriso]( https://github.com/chriso ).

## Installation

```
npm install express-validator
```

## Usage

```javascript
var util = require('util'),
    express = require('express'),
    expressValidator = require('express-validator'),
    app = express.createServer();

app.use(express.bodyParser());
app.use(expressValidator([options])); // this line must be immediately after express.bodyParser()!

app.post('/:urlparam', function(req, res) {

  // checkBody only checks req.body; none of the other req parameters
  req.checkBody('postparam', 'Invalid postparam').notEmpty().isInt();
  req.assert('getparam', 'Invalid getparam').isInt();
  req.assert('urlparam', 'Invalid urlparam').isAlpha();

  req.sanitize('postparam').toBoolean();

  var errors = req.validationErrors();
  if (errors) {
    res.send('There have been validation errors: ' + util.inspect(errors), 400);
    return;
  }
  res.json({
    urlparam: req.param('urlparam'),
    getparam: req.param('getparam'),
    postparam: req.param('postparam')
  });
});

app.listen(8888);
```

Which will result in:

```
$ curl -d 'postparam=1' http://localhost:8888/test?getparam=1
{"urlparam":"test","getparam":"1","postparam":true}

$ curl -d 'postparam=1' http://localhost:8888/t1est?getparam=1
There have been validation errors: [
  { param: 'urlparam', msg: 'Invalid urlparam', value: 't1est' } ]

$ curl -d 'postparam=1' http://localhost:8888/t1est?getparam=1ab
There have been validation errors: [
  { param: 'getparam', msg: 'Invalid getparam', value: '1ab' },
  { param: 'urlparam', msg: 'Invalid urlparam', value: 't1est' } ]

$ curl http://localhost:8888/test?getparam=1&postparam=1
There have been validation errors: [
  { param: 'postparam', msg: 'Invalid postparam', value: undefined} ]
```

### Middleware Options
####`errorFormatter`
_function(param,msg,value)_

The `errorFormatter` option can be used to specify a function that can be used to format the objects that populate the error array that is returned in `req.validationErrors()`. It should return an `Object` that has `param`, `msg`, and `value` keys defined.

```javascript
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
```

### Validation errors

You have two choices on how to get the validation errors:

```javascript
req.assert('email', 'required').notEmpty();
req.assert('email', 'valid email required').isEmail();
req.assert('password', '6 to 20 characters required').len(6, 20);

var errors = req.validationErrors();
var mappedErrors = req.validationErrors(true);
```

errors:

```javascript
[
  {param: "email", msg: "required", value: "<received input>"},
  {param: "email", msg: "valid email required", value: "<received input>"},
  {param: "password", msg: "6 to 20 characters required", value: "<received input>"}
]
```

mappedErrors:

```javascript
{
  email: {
    param: "email",
    msg: "valid email required",
    value: "<received input>"
  },
  password: {
    param: "password",
    msg: "6 to 20 characters required",
    value: "<received input>"
  }
}
```

### Nested input data

Example:

```html
<input name="user[fields][email]" />
```

Provide an array instead of a string:

```javascript
req.assert(['user', 'fields', 'email'], 'valid email required').isEmail();
var errors = req.validationErrors();
console.log(errors);
```

Output:

```javascript
[
  {
    param: "user_fields_email",
    msg: "valid email required",
    value: "<received input>"
  }
]
```

Alternatively you can use dot-notation to specify nested fields to be checked:

```javascript
req.assert(['user.fields.email'], 'valid email required').isEmail();
```

### Regex routes

Express allows you to define regex routes like:

```javascript
app.get(/\/test(\d+)/, function() {});
```

You can validate the extracted matches like this:

```javascript
req.assert(0, 'Not a three-digit integer.').len(3, 3).isInt();
```

### Extending

You can extend the `Validator` and `Filter` objects to add custom validation
and sanitization method.

Custom validation which always fails. Useful for debugging or for
adding messages manually when doing complex validation:

```javascript
var expressValidator = require('express-validator');

expressValidator.Validator.prototype.fail = function() {
  //You could validate against this.str, instead of just erroring out.

  this.error(this.msg);
  return this;
};
```

Custom sanitization which lower-cases the string:

```javascript
expressValidator.Filter.prototype.toLowerCase = function(){
  this.modify(this.str.toLowerCase());
  return this.str;
};
```

## Changelog

### v0.4.1
- Update this readme

### v0.4.0
- Added `req.checkBody()` (@zero21xxx).
- Upgraded validator dependency to 1.1.3

### v0.3.0
- `req.validationErrors()` now returns `null` instead of `false` if there are no errors.

### v0.2.4
- Support for regex routes (@Cecchi)

### v0.2.3
- Fix checkHeader() (@pimguilherme)

### v0.2.2
- Add dot-notation for nested input (@sharonjl)
- Add validate() alias for check()

### v0.2.1
- Fix chaining validators (@rapee)

### v0.2.0
- Added `validationErrors()` method (by @orfaust)
- Added support for nested form fields (by @orfaust)
- Added test cases

### v0.1.3
- Readme update

### v0.1.2
- Expose Filter and Validator instances to allow adding custom methods

### v0.1.1
- Use req.param() method to get parameter values instead of accessing
  req.params directly.
- Remove req.mixinParams() method.

### v0.1.0
- Initial release

## Contributors

- Christoph Tavan <dev@tavan.de> - Wrap the gist in an npm package
- @orfaust - Add `validationErrors()` and nested field support
- @zero21xxx - Added `checkBody` function

## License

Copyright (c) 2010 Chris O'Hara <cohara87@gmail.com>, MIT License

