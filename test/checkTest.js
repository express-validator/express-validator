var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMessage = 'Parameter is not an integer';

// There are three ways to pass parameters to express:
// - as part of the URL
// - as GET parameter in the querystring
// - as POST parameter in the body
// URL params take precedence over GET params which take precedence over
// POST params.

function validation(req, res) {
  req.check('testparam', errorMessage).notEmpty().isInt();

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send({ testparam: req.params.testparam || req.query.testparam || req.body.testparam });
}

function fail(body) {
  expect(body).to.have.length(1);
  expect(body[0]).to.have.property('msg', errorMessage);
}

function pass(body) {
  expect(body).to.have.property('testparam', '42');
}

function getRoute(path, test, done) {
  request(app)
    .get(path)
    .end(function(err, res) {
      test(res.body);
      done();
    });
}

function postRoute(path, data, test, done) {
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

describe('#check()/#assert()/#validate()', function() {
  describe('GET tests', function() {
    it('should return an error when param does not validate', function(done) {
      getRoute('/test', fail, done);
    });

    it('should return a success when param validates', function(done) {
      getRoute('/42', pass, done);
    });

    // GET only: Test URL over GET param precedence

    it('should return an error when param and query does not validate', function(done) {
      getRoute('/test?testparam=gettest', fail, done);
    });

    it('should return a success when param validates, but query does not', function(done) {
      getRoute('/42?testparam=gettest', pass, done);
    });

    it('should return an error when query does not validate', function(done) {
      getRoute('/?testparam=test', fail, done);
    });

    it('should return a success when query validates', function(done) {
      getRoute('/?testparam=42', pass, done);
    });
  });

  describe('POST tests', function() {
    it('should return an error when param does not validate', function(done) {
      postRoute('/test', null, fail, done);
    });

    it('should return a success when param validates', function(done) {
      postRoute('/42', null, pass, done);
    });

    // POST only: Test URL over GET over POST param precedence

    it('should return an error when body validates, but failing param/query is present', function(done) {
      postRoute('/test?testparam=gettest', { testparam: '42' }, fail, done);
    });

    it('should return a success when param validates, but non-validating body is present', function(done) {
      postRoute('/42?testparam=42', { testparam: 'posttest' }, pass, done);
    });

    it('should return an error when query does not validate, but body validates', function(done) {
      postRoute('/?testparam=test', { testparam: '42' }, fail, done);
    });

    it('should return a success when query validates, but non-validating body is present', function(done) {
      postRoute('/?testparam=42', { testparam: 'posttest' }, pass, done);
    });

    it('should return an error when body does not validate', function(done) {
      postRoute('/', { testparam: 'test' }, fail, done);
    });

    it('should return a success when body validates', function(done) {
      postRoute('/', { testparam: '42' }, pass, done);
    });
  });

});