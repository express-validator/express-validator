var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMessage = 'Parameter is not an integer';

function validation(req, res) {
  req.assert('optional_param', errorMessage).optional().isInt();

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send({ result: 'OK' });
}

function fail(body) {
  expect(body).to.have.length(1);
  expect(body[0]).to.have.property('msg', errorMessage);
}

function pass(body) {
  expect(body).to.have.property('result', 'OK');
}

function testRoute(path, test, done) {
  request(app)
    .get(path)
    .end(function(err, res) {
      test(res.body);
      done();
    });
}

// This before() is required in each set of tests in
// order to use a new validation function in each file
before(function() {
  delete require.cache[require.resolve('./helpers/app')];
  app = require('./helpers/app')(validation);
});

// TODO: Don't know if all of these are necessary, but we do need to test body and header
describe('#optional()', function() {
  it('should return a success when there is an empty route', function(done) {
    testRoute('/', pass, done);
  });

  it('should return a success when there are no params on a route', function(done) {
    testRoute('/path', pass, done);
  });

  it('should return a success when the non-optional param is present', function(done) {
    testRoute('/path?other_param=test', pass, done);
  });

  it('should return an error when param is provided, but empty', function(done) {
    testRoute('/path?optional_param', fail, done);
  });

  it('should return an error when param is provided with equals sign, but empty', function(done) {
    testRoute('/path?optional_param=', fail, done);
  });

  it('should return an error when param is provided, but fails validation', function(done) {
    testRoute('/path?optional_param=test', fail, done);
  });

  it('should return a success when param is provided and validated', function(done) {
    testRoute('/path?optional_param=123', pass, done);
  });
});