var assert = require('assert');
var async = require('async');

var App = require('./helpers/app');
var req = require('./helpers/req');

var port = process.env.NODE_HTTP_PORT || 8888;
var url = 'http://localhost:' + port;

// There are three ways to pass parameters to express:
// - as part of the URL
// - as GET parameter in the querystring
// - as POST parameter in the body
// These test show that req.checkParams are only interested in req.params values, all other
// parameters will be ignored.

var errorMessage = 'Parameter is not an integer';
var validation = function(req, res) {
  req.checkParams('testparam', errorMessage).notEmpty().isInt();

  var errors = req.validationErrors();
  if (errors) {
    res.json(errors);
    return;
  }
  res.json({testparam: req.params.testparam});
};
var app = new App(port, validation);
app.start();

function fail(count) {
  return function(params) {
    assert.equal(params.length, count);
    assert.deepEqual(params[0].msg, errorMessage);
  }
}
function pass(params) {
  assert.deepEqual(params, {testparam: '42'});
}

var tests = [
  async.apply(req, 'get', url + '/test', fail(1)),
  async.apply(req, 'post', url + '/test', fail(1)),
  async.apply(req, 'get', url + '/', fail(2)),
  async.apply(req, 'post', url + '/', fail(2)),

  // Test req.params
  async.apply(req, 'get', url + '/42', pass),
  async.apply(req, 'post', url + '/42', pass),

  async.apply(req, 'get', url + '/test', fail(1)),
  async.apply(req, 'post', url + '/test', fail(1)),
  async.apply(req, 'get', url + '/42?testparam=42', pass),
  async.apply(req, 'post', url + '/42?testparam=42', pass),
  async.apply(req, 'get', url + '/test?testparam=aejhaze', fail(1)),
  async.apply(req, 'post', url + '/test?testparam=aejhaze', fail(1)),
  async.apply(req, 'get', url + '/42?testparam=42', {json: {testparam: 'posttest'}}, pass),
  async.apply(req, 'post', url + '/42?testparam=42', {json: {testparam: 'posttest'}}, pass),
  async.apply(req, 'get', url + '/test?testparam=pouet', {json: {testparam: 'posttest'}}, fail(1)),
  async.apply(req, 'post', url + '/test?testparam=pouet', {json: {testparam: 'posttest'}}, fail(1)),
  async.apply(req, 'get', url + '/?testparam=pouet', {json: {testparam: 'posttest'}}, fail(2)),
  async.apply(req, 'post', url + '/?testparam=pouet', {json: {testparam: 'posttest'}}, fail(2))
]

async.parallel(tests, function(err) {
  assert.ifError(err);
  app.stop();
  console.log('All %d tests passed.', tests.length);
});
