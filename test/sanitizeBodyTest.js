var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
function validation(req, res) {
  req.sanitizeBody('testparam').whitelist(['a', 'b', 'c']);
  res.send({ body: req.body });
}

function pass(body) {
  expect(body).to.have.deep.property('body.testparam', 'abc');
}
function fail(body) {
  expect(body).to.not.have.property('body', 'testparam');
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

describe('#sanitizeBody', function() {
  describe('POST tests', function() {
    it('should return property and sanitized value when body param is present', function(done) {
      postRoute('/', { testparam: '   abcdf    ' }, pass, done);
    });

    it('should not return property when body param is missing', function(done) {
      postRoute('/', null, fail, done);
    });

  });
});
