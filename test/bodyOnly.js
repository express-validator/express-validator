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
// These test show that req.checkBody are only interested in req.body values, all other
// parameters will be ignored.

var errorMessage = 'Parameter is not an integer';
var validation = function(req, res) {
  req.checkBody('testparam', errorMessage).notEmpty().isInt();
  req.checkBody('arrayParam').isArray();

  var errors = req.validationErrors();
  if (errors) {
    res.json(errors);
    return;
  }
  res.json({testparam: req.body.testparam});
};
var app = new App(port, validation);
app.start();

function fail(count) {
  return function(body) {
    assert.equal(body.length, count);
    assert.deepEqual(body[0].msg, errorMessage);
  }
}
function pass(body) {
  assert.deepEqual(body, {testparam: 123});
}

var tests = [
  // Test URL param this should always fail because it ONLY looks at the body and it fails both notEmpty() and isInt()
  async.apply(req, 'get', url + '/test', fail(3)),
  async.apply(req, 'get', url + '/123', fail(3)),
  async.apply(req, 'post', url + '/test', fail(3)),
  async.apply(req, 'post', url + '/123', fail(3)),

  // Test POST param
  async.apply(req, 'post', url + '/test?testparam=gettest', fail(3)),
  async.apply(req, 'post', url + '/123?testparam=123', fail(3)),
  async.apply(req, 'post', url + '/123?testparam=123', {json: {testparam: 'posttest'}}, fail(2)),
  async.apply(req, 'post', url + '/?testparam=test', {json: {testparam: 123, arrayParam: [1,2,3]}}, pass),
  async.apply(req, 'post', url + '/?testparam=123', {json: {testparam: 'posttest', arrayParam: 123}}, fail(2)),
  async.apply(req, 'post', url + '/?testparam=123', {json: {testparam: 'posttest', arrayParam: {}}}, fail(2)),
  async.apply(req, 'post', url + '/', {json: {testparam: 'test'}, arrayParam: '[]'}, fail(2)),
  async.apply(req, 'post', url + '/', {json: {testparam: 123, arrayParam: []}}, pass)
]

async.parallel(tests, function(err) {
  assert.ifError(err);
  app.stop();
  console.log('All %d tests passed.', tests.length);
});
