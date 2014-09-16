var assert = require('assert');
var async = require('async');

var App = require('./helpers/app');
var req = require('./helpers/req');

var port = process.env.NODE_HTTP_PORT || 8888;
var url = 'http://localhost:' + port;

// Test optional values

var errorMessage = 'Parameter is not an integer';
var validation = function(req, res) {
  req.assert('optional_param', errorMessage).optional().isInt();

  var errors = req.validationErrors();
  if (errors) {
    res.json(errors);
    return;
  }
  res.json({result: 'OK'});
};
var app = new App(port, validation);
app.start();

function fail(body) {
  assert.equal(body.length, 1);
  assert.deepEqual(body[0].msg, errorMessage);
}
function pass(body) {
  assert.deepEqual(body, {result: 'OK'});
}

var tests = [
  // Test URL param defined by RegExp
    async.apply(req, 'get', url + '/', pass),
    async.apply(req, 'get', url + '/path', pass),
    async.apply(req, 'get', url + '/path?other_param=test', pass),
    async.apply(req, 'get', url + '/path?optional_param', fail),
    async.apply(req, 'get', url + '/path?optional_param=', fail),
    async.apply(req, 'get', url + '/path?optional_param=test', fail),
    async.apply(req, 'get', url + '/path?optional_param=123', pass)
];

async.parallel(tests, function(err) {
  assert.ifError(err);
  app.stop();
  console.log('All %d tests passed.', tests.length);
});
