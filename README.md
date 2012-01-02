# express-validator

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
var express = require('express'),
    expressValidator = require('express-validator'),
    app = express.createServer();

app.use(express.bodyParser());
app.use(expressValidator);

app.post('/:urlparam', function(req, res) {
  var errors = [];
  req.onValidationError(function(msg) {
    console.log('Validation error: ' + msg);
    errors.push(msg);
    return this;
  });

  req.assert('postparam', 'Invalid postparam').notEmpty().isInt();
  req.assert('getparam', 'Invalid getparam').isInt();
  req.assert('urlparam', 'Invalid urlparam').isAlpha();

  req.sanitize('postparam').toBoolean();

  if (errors.length) {
    res.send('There have been validation errors: ' + errors.join(', '), 500);
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
There have been validation errors: Invalid urlparam

$ curl -d 'postparam=1' http://localhost:8888/t1est?getparam=1ab
There have been validation errors: Invalid getparam, Invalid foo
```

You can extend the `Validator` and `Filter` objects to add custom validation
and sanitization methods:

```javascript
var expressValidator = require('express-validator');

expressValidator.Filter.prototype.toLowerCase = function(){
  this.modify(this.str.toLowerCase());
  return this.str;
};
```


## Changelog

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

## License

Copyright (c) 2010 Chris O'Hara <cohara87@gmail.com>, MIT License

