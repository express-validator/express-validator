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
  console.log(req.params.hasOwnProperty('foo'));

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
