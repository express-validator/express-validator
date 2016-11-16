var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMessage = 'Parameter is not an integer';

// There are three ways to pass parameters to express:
// - as part of the URL
// - as GET parameter in the querystring
// - as POST parameter in the body
// These test show that req.checkQuery are only interested in req.query values, all other
// parameters will be ignored.

function validation(req, res) {
  req.checkHeaders('Test-Param', errorMessage).notEmpty().isInt();

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send({ testparam: req.get('test-param') });
}

function fail(body, length) {
  expect(body).to.have.length(length);
  expect(body[0]).to.have.property('msg', errorMessage);
}

function pass(body) {
  expect(body).to.have.property('testparam', '123');
}

function getRoute(path, data, test, length, done) {
  request(app)
    .get(path)
    .set('Test-Param', data)
    .end(function(err, res) {
      test(res.body, length);
      done();
    });
}

// This before() is required in each set of tests in
// order to use a new validation function in each file
before(function() {
  delete require.cache[require.resolve('./helpers/app')];
  app = require('./helpers/app')(validation);
});

describe('#checkHeaders()', function() {
  it('should return two errors when header is missing', function(done) {
    getRoute('/', '', fail, 2, done);
  });

  it('should return a success when header validates', function(done) {
    getRoute('/', '123', pass, null, done);
  });

  it('should return one error when header does not validate as int', function(done) {
    getRoute('/', 'blah', fail, 1, done);
  });

});