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
// These test show that req.checkQuery are only interested in req.query values, all other
// parameters will be ignored.

var errorMessage = 'Parameter is not an integer';
var validation = function(req, res) {
  req.checkQuery('testparam', errorMessage).notEmpty().isInt();

  var errors = req.validationErrors();
  if (errors) {
    res.json(errors);
    return;
  }
  res.json({testparam: req.query.testparam});
};
var app = new App(port, validation);
app.start();

function fail(count) {
  return function(query) {
    assert.equal(query.length, count);
    assert.deepEqual(query[0].msg, errorMessage);
  }
}
function pass(query) {
  assert.deepEqual(query, {testparam: '42'});
}

var tests = [
  // Test URL param this should always fail because it ONLY looks at the query and it fails both notEmpty() and isInt()
  async.apply(req, 'get', url + '/test', fail(2)),
  async.apply(req, 'get', url + '/123', fail(2)),
  async.apply(req, 'post', url + '/test', fail(2)),
  async.apply(req, 'post', url + '/123', fail(2)),

  // Test POST param
  async.apply(req, 'get', url + '/test', fail(2)),
  async.apply(req, 'post', url + '/test', fail(2)),
  async.apply(req, 'get', url + '/test?testparam=42', pass),
  async.apply(req, 'post', url + '/test?testparam=42', pass),
  async.apply(req, 'get', url + '/test?testparam=aejhaze', fail(1)),
  async.apply(req, 'post', url + '/test?testparam=aejhaze', fail(1)),
  async.apply(req, 'get', url + '/?testparam=42', {json: {testparam: 'posttest'}}, pass),
  async.apply(req, 'post', url + '/?testparam=42', {json: {testparam: 'posttest'}}, pass),
  async.apply(req, 'get', url + '/?testparam=pouet', {json: {testparam: 'posttest'}}, fail(1)),
  async.apply(req, 'post', url + '/?testparam=pouet', {json: {testparam: 'posttest'}}, fail(1))
]

async.parallel(tests, function(err) {
  assert.ifError(err);
  app.stop();
  console.log('All %d tests passed.', tests.length);
});
