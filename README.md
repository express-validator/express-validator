# express-validator

An [express.js]( https://github.com/visionmedia/express ) middleware for
[node-validator]( https://github.com/chriso/node-validator ).

This is basically a copy of a [gist]( https://gist.github.com/752126 ) by
node-validator author [chriso]( https://github.com/chriso ).

## Usage

``` javascript
var express = require('express'),
    expressValidator = require('express-validator'),
    app = express.createServer();

app.use(express.bodyParser());
app.use(expressValidator);

app.post('/:foo', function(req, res) {
  var errors = [];
  req.onValidationError(function(msg) {
    console.log('Validation error: ' + msg);
    errors.push(msg);
  });

  req.mixinParams();

  req.assert('postparam', 'Invalid postparam').isInt();
  req.assert('getparam', 'Invalid getparam').isInt();
  req.assert('foo', 'Invalid foo').isAlpha();

  req.sanitize('postparam').toBoolean();

  if (errors.length) {
    res.send('There have been validation errors: ' + errors.join(', '), 500);
    return;
  }
  res.json(req.params);
});

app.listen(8888);
```

Which will result in:

```
$ curl -d 'postparam=1' http://localhost:8888/test?getparam=1
{"foo":"test","getparam":"1","postparam":true}

$ curl -d 'postparam=1' http://localhost:8888/t1est?getparam=1
There have been validation errors: Invalid foo

$ curl -d 'postparam=1' http://localhost:8888/t1est?getparam=1ab
There have been validation errors: Invalid getparam, Invalid foo
```

## Contributors

- Christoph Tavan <dev@tavan.de> - Wrap the gist in an npm package

## Licence

Copyright (c) 2010 Chris O'Hara <cohara87@gmail.com>, MIT License

