// Test config
var assert = require('assert');
var async = require('async');
var request = require('request');
var errorMessage = 'Parameter is not an integer';
var port = process.env.NODE_HTTP_PORT || 8888;
var url = 'http://localhost:' + port;

// Sample app
var express = require('express');
var expressValidator = require('../index.js');
var app = express.createServer();

app.use(express.bodyParser());
app.use(expressValidator);

function testAction(req, res) {
  var errors = [];
  req.onValidationError(function(msg) {
    errors.push(msg);
    return this;
  });

  req.assert('testparam', errorMessage).notEmpty().isInt();

  if (errors.length) {
    res.json({errors: errors});
    return;
  }
  res.json({testparam: req.param('testparam')});
}
app.get('/:testparam?', testAction);
app.post('/:testparam?', testAction);

app.listen(port);

// Tests

// There are three ways to pass parameters to express:
// - as part of the URL
// - as GET parameter in the querystring
// - as POST parameter in the body
// URL params take precedence over GET params which take precedence over
// POST params.

function fail(body) {
  assert.deepEqual(body, {errors: [errorMessage]});
}
function pass(body) {
  assert.deepEqual(body, {testparam: 123});
}
var check = function(assertion, cb) {
  return function(err, res, body) {
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return cb(e);
      }
    }
    assertion(body);
    cb(null);
  };
};

function req() {
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();
  var assertion = args.pop();
  var method = args.shift();
  args.push(check(assertion, cb));
  request[method].apply(this, args);
}

var tests = [
  // Test URL param
  async.apply(req, 'get', url + '/test', fail),
  async.apply(req, 'get', url + '/123', pass),
  async.apply(req, 'post', url + '/test', fail),
  async.apply(req, 'post', url + '/123', pass),

  // Test GET param and URL over GET param precedence
  async.apply(req, 'get', url + '/test?testparam=gettest', fail),
  async.apply(req, 'get', url + '/123?testparam=gettest', pass),
  async.apply(req, 'get', url + '/123?testparam=gettest', pass),
  async.apply(req, 'get', url + '/?testparam=test', fail),
  async.apply(req, 'get', url + '/?testparam=123', pass),

  // Test POST param and URL over GET over POST param precedence
  async.apply(req, 'post', url + '/test?testparam=gettest', {json: {testparam: 123}}, fail),
  async.apply(req, 'post', url + '/123?testparam=123', {json: {testparam: 'posttest'}}, pass),
  async.apply(req, 'post', url + '/123?testparam=123', {json: {testparam: 'posttest'}}, pass),
  async.apply(req, 'post', url + '/?testparam=test', {json: {testparam: 123}}, fail),
  async.apply(req, 'post', url + '/?testparam=123', {json: {testparam: 'posttest'}}, pass),
  async.apply(req, 'post', url + '/', {json: {testparam: 'test'}}, fail),
  async.apply(req, 'post', url + '/', {json: {testparam: 123}}, pass)
];

async.parallel(tests, function(err) {
  assert.ifError(err);
  app.close();
  console.log('All %d tests passed.', tests.length);
});

