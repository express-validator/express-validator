var assert = require('assert');
var async = require('async');

var App = require('./helpers/app');
var req = require('./helpers/req');

var port = process.env.NODE_HTTP_PORT || 8888;
var url = 'http://localhost:' + port;

// Error descriptions can be selected in a mapped way

var validation = function(req, res) {
  req.assert('email', 'required').notEmpty();
  req.assert('email', 'valid email required').isEmail();

  var errors = req.validationErrors(true);
  if (errors) {
    res.json(errors);
    return;
  }
  res.json({email: req.param('email')});
};
var app = new App(port, validation);
app.start();

function fail(body) {
  assert.deepEqual(body.email.msg, 'valid email required');
}
function pass(body) {
  assert.deepEqual(body, {email: 'test@example.com'});
}

var tests = [
  async.apply(req, 'post', url + '/', {
    json: {
      email: 'test@example.com'
    }
  }, pass),
  async.apply(req, 'post', url + '/', {
    json: {
      email: ''
    }
  }, fail)
];

async.parallel(tests, function(err) {
  assert.ifError(err);
  app.stop();
  console.log('All %d tests passed.', tests.length);
});
