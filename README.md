# express-validator

express.js middleware for node-validator.

This is basically a copy of a [https://gist.github.com/752126](gist) by
node-validator author [https://github.com/chriso](chriso).

## Usage

``` javascript
var express = require('express'),
    expressValidator = require('express-validator'),
    app = express.createServer();

app.use(express.bodyParser());
app.use(expressValidator);

app.post('/:foo', function(req, res) {
  req.onValidationError(function(msg) {
    console.log('Validation error: ' + msg);
  });

  req.mixinParams();

  req.assert('postparam', 'Invalid postparam').isInt();
  req.assert('getparam', 'Invalid getparam').isInt();
  req.assert('foo', 'Invalid foo').isAlpha();

  req.sanitize('postparam').toBoolean();

  res.json(req.params);
});

app.listen(8888);
```
