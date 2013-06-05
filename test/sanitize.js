var assert = require('assert');
var async = require('async');

var App = require('./helpers/app');
var req = require('./helpers/req');

var port = process.env.NODE_HTTP_PORT || 8888;
var url = 'http://localhost:' + port;

var validation = function(req, res) {
  req.sanitize(['user', 'email']).trim();
  req.sanitize('user.name').trim();
  req.sanitize('field').trim();

  req.assert(['user', 'email'], 'length').len(16);
  req.assert(['user', 'name'], 'length').len(10);
  req.assert('field', 'length').len(5);

  var errors = req.validationErrors();
  if (errors) {
    res.json(errors);
    return;
  }

  res.json(req.body);
};

var app = new App(port, validation);
app.start();

function fail(body) {
  assert.deepEqual(body[0].msg, 'length');
  assert.deepEqual(body[1].msg, 'length');
  assert.deepEqual(body[2].msg, 'length');
}

function pass(body) {
  assert.deepEqual(body, {
    user: {
      email: 'test@example.com',
      name: 'John Smith'
    },
    field: 'field'
  });
}

var tests = [
  async.apply(req, 'post', url + '/', {
    json: {
      user: {
        email: '     test@example.com     ',
        name: '     John Smith     '
      },
      field: '     field     '
    }
  }, pass),
  async.apply(req, 'post', url + '/', {
    json: {
      user: {
        email: '',
        name: ''
      },
      field: ''
    }
  }, fail)
];

async.parallel(tests, function(err) {
  assert.ifError(err);
  app.stop();
  console.log('All %d tests passed.', tests.length);
})