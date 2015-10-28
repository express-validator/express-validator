var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
function validation(req, res) {
  req.sanitizeHeaders('x-custom-header').trim();
  res.send(req.headers);
}

function pass(body) {
  expect(body).to.have.property('x-custom-header', 'space');
}
function fail(body) {
  expect(body).to.have.property('x-custom-header').and.to.not.equal('space');
}

function getRoute(path, data, test, done) {
  request(app)
    .get(path)
    .set('x-custom-header', data)
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

describe('#sanitizeHeaders', function() {
  describe('GET tests', function() {
    it('should return property and sanitized value when headers param is present', function(done) {
      getRoute('/', 'space   ', pass, done);
    });

    it('should not return property when headers param is missing', function(done) {
      getRoute('/', null, fail, done);
    });
  });
});
