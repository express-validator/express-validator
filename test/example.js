var express = require('express'),
    expressValidator = require('../index.js'),
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
