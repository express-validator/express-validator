var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
function validation(req, res) {
  req.sanitizeParams('testparam').whitelist(['a', 'b', 'c']);
  res.send({ params: req.params });
}

function pass(body) {
  expect(body).to.have.deep.property('params.testparam', 'abc');
}
function fail(body) {
  expect(body).to.not.have.property('params', 'testparam');
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

describe('#sanitizeParams', function() {
  describe('GET tests', function() {
    it('should return property and sanitized value when param is present', function(done) {
      getRoute('/abcdef', pass, done);
    });
    it('should not return property when param is missing', function(done) {
      getRoute('/', fail, done);
    });


  });
  describe('POST tests', function() {
    it('should return property and sanitized value when param is present', function(done) {
      postRoute('/abcdef', null, pass, done);
    });

    it('should not return property when param is missing', function(done) {
      postRoute('/', null, fail, done);
    });

  });
});
