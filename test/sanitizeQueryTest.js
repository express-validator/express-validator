var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
function validation(req, res) {
  req.sanitizeQuery('testparam').whitelist(['a', 'b', 'c']);
  res.send({ query: req.query });
}

function pass(body) {
  expect(body).to.have.deep.property('query.testparam', 'abc');
}
function fail(body) {
  expect(body).to.not.have.property('query', 'testparam');
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

describe('#sanitizeQuery', function() {
  describe('GET tests', function() {
    it('should return property and sanitized value when query param is present', function(done) {
      getRoute('/?testparam=abcdef', pass, done);
    });
    it('should not return property when query param is missing', function(done) {
      getRoute('/', fail, done);
    });


  });
  describe('POST tests', function() {
    it('should return property and sanitized value when query param is present', function(done) {
      postRoute('/?testparam=abcdef', null, pass, done);
    });

    it('should not return property when query param is missing', function(done) {
      postRoute('/', null, fail, done);
    });

  });
});
