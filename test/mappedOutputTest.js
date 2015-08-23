var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMessage = 'valid email required';

function validation(req, res) {
  req.assert('email', 'required').notEmpty();
  req.assert('email', errorMessage).isEmail();

  var errors = req.validationErrors(true);
  if (errors) {
    return res.send(errors);
  }
  res.send({ email: req.params.email || req.query.email || req.body.email });
}

function fail(body) {
  expect(body).to.have.deep.property('email.msg', errorMessage);
}

function pass(body) {
  expect(body).to.have.property('email', 'test@example.com');
}

function testRoute(path, data, test, done) {
  request(app)
    .post(path)
    .send(data)
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

describe('#validationErrors(true)', function() {
  it('should return a success when the correct data is passed on the body', function(done) {
    testRoute('/', { email: 'test@example.com' }, pass, done);
  });

  it('should return a mapped error object with each failing param as a property data is invalid', function(done) {
    testRoute('/path', { email: 'incorrect' }, fail, done);
  });
});