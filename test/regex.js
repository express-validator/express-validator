var assert = require('assert');
var async = require('async');

var App = require('./helpers/app');
var req = require('./helpers/req');

var port = process.env.NODE_HTTP_PORT || 8888;
var url = 'http://localhost:' + port;

// Express routes can be defined using regular expressions

var errorMessage = 'Parameter is not a 3 digit integer';
var validation = function(req, res) {
  req.assert(0, errorMessage).len(3, 3).isInt();

  var errors = req.validationErrors();
  if (errors) {
    res.json(errors);
    return;
  }
  res.json([req.params[0]]);
};
var app = new App(port, validation);
app.start();

function fail(body) {
  assert.equal(body.length, 2);
  assert.deepEqual(body[0].msg, errorMessage);
}
function pass(body) {
  assert.deepEqual(body, [ '123' ]);
}

var tests = [
  // Test URL param defined by RegExp
  async.apply(req, 'get', url + '/test123', pass),
  async.apply(req, 'get', url + '/test0123', fail)
];

async.parallel(tests, function(err) {
  assert.ifError(err);
  app.stop();
  console.log('All %d tests passed.', tests.length);
});
