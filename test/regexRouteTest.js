var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMessage = 'Parameter is not a 3 digit integer';

function validation(req, res) {
  req.assert(0, errorMessage).len(3, 3).isInt();

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send([req.params[0]]);
}

function fail(body) {
  expect(body).to.have.length(2);
  expect(body[0]).to.have.property('msg', errorMessage);
}

function pass(body) {
  expect(body[0]).to.equal('123');
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

describe('Express routes can be defined using regular expressions', function() {
  it('should return a success when regex route is validated', function(done) {
    testRoute('/test123', pass, done);
  });

  it('should return an error when regex route is not validated', function(done) {
    testRoute('/test0123', fail, done);
  });
});