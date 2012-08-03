var assert = require('assert');
var async = require('async');

var App = require('./helpers/app');
var req = require('./helpers/req');

var port = process.env.NODE_HTTP_PORT || 8888;
var url = 'http://localhost:' + port;

// Nested parameters are also supported

var validation = function(req, res) {
  req.assert(['user', 'fields', 'email'], 'not empty').notEmpty();
  req.assert('user.fields.email', 'not empty').notEmpty();
  req.assert(['user', 'fields', 'email'], 'valid email required').isEmail();

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
  assert.deepEqual(body[0].msg, 'not empty');
  assert.deepEqual(body[1].msg, 'not empty');
  assert.deepEqual(body[2].msg, 'valid email required');
}
function pass(body) {
  assert.deepEqual(body, {
    user: {
      fields: {
        email: 'test@example.com'
      }
    }
  });
}

var tests = [
  async.apply(req, 'post', url + '/', {
    json: {
      user: {
        fields: {
          email: 'test@example.com'
        }
      }
    }
  }, pass),
  async.apply(req, 'post', url + '/', {
    json: {
      user: {
        fields: {
          email: ''
        }
      }
    }
  }, fail)
];

async.parallel(tests, function(err) {
  assert.ifError(err);
  app.stop();
  console.log('All %d tests passed.', tests.length);
});
