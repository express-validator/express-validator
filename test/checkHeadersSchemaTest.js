var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMessage = 'Parameter is not valid';

function validation(req, res) {
  req.checkHeaders({
    'testparam': {
      notEmpty: true,
      errorMessage: errorMessage,
      isInt: true
    }
  });

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send({ testparam: req.headers.testparam });
}

function fail(body, length) {
  expect(body).to.have.length(length);
  expect(body[0]).to.have.property('msg', errorMessage);
}

function failMulti(body, length) {
  expect(body).to.have.length(length);
  expect(body[0]).to.have.property('msg', errorMessage);
  expect(body[1]).to.have.property('msg', errorMessage);
}

function pass(body) {
  expect(body).to.have.property('testparam', '42');
}

function getRoute(path, headers, test, length, done) {
  request(app)
    .get(path)
    .set(headers || { 'x-header': 'test' })
    .end(function(err, res) {
      test(res.body, length);
      done();
    });
}

function postRoute(path, headers, data, test, length, done) {
  request(app)
    .post(path)
    .set(headers || { 'x-header': 'test' })
    .send(data)
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

describe('#checkHeadersSchema()', function() {
  describe('GET tests', function() {
    it('should return two errors when header is missing, and unrelated param is present', function(done) {
      getRoute('/', { whatever: 'yes' }, failMulti, 2, done);
    });

    it('should return two errors when header is missing', function(done) {
      getRoute('/', { }, failMulti, 2, done);
    });

    it('should return a success when header validates and unrelated header is present', function(done) {
      getRoute('/', { testparam: 42, whatever: 'yes' }, pass, null, done);
    });

    it('should return one error when header does not validate as int and unrelated header is present', function(done) {
      getRoute('/', { testparam: 'here', whatever: 'yes' }, fail, 1, done);
    });
  });

  describe('POST tests', function() {
    it('should return two errors when header is missing, and unrelated param is present', function(done) {
      postRoute('/', { whatever: 'yes' }, null, failMulti, 2, done);
    });

    it('should return two errors when header is missing', function(done) {
      postRoute('/', { }, null, failMulti, 2, done);
    });

    it('should return a success when header validates and unrelated header is present', function(done) {
      postRoute('/', { testparam: 42, whatever: 'yes' }, null, pass, null, done);
    });

    it('should return one error when header does not validate as int and unrelated header is present', function(done) {
      postRoute('/', { testparam: 'here', whatever: 'yes' }, null, fail, 1, done);
    });

    // POST only

    it('should return a success when header validates and unrelated param/body is present', function(done) {
      postRoute('/', { testparam: 42 }, { testparam: 'posttest' }, pass, null, done);
    });

    it('should return one error when header does not validate as int and unrelated param/body is present', function(done) {
      postRoute('/', { testparam: 'NOTINT' }, { testparam: '42' }, fail, 1, done);
    });

    it('should return two errors when header is missing and unrelated body is present', function(done) {
      postRoute('/', {  }, { testparam: '42' }, failMulti, 2, done);
    });
  });

});
