var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var errorMessage = 'Invalid param';

var app;

function validation(req, res) {
  req.checkBody({
    'testparam': {
      notEmpty: true,
      isInt: true
    },
    'arrayParam': {
      isArray: true
    }
  });

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }

  res.send({ testparam: req.body.testparam });
}

function fail(body, length) {
  expect(body).to.have.length(length);
  expect(body[0]).to.have.property('msg', errorMessage);
}

function pass(body) {
  expect(body).to.have.property('testparam', '42');
}

function getRoute(path, test, length, done) {
  request(app)
    .get(path)
    .end(function(err, res) {
      test(res.body, length);
      done();
    });
}

function postRoute(path, data, test, length, done) {
  request(app)
    .post(path)
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

describe('#checkBodySchema()', function() {
  describe('GET tests', function() {
    it('should return three errors when param is missing', function(done) {
      getRoute('/', fail, 3, done);
    });

    it('should return three errors when param is present, but not in the body', function(done) {
      getRoute('/42', fail, 3, done);
    });
  });

  describe('POST tests', function() {
    it('should return three errors when param is missing', function(done) {
      postRoute('/', null, fail, 3, done);
    });

    it('should return three errors when param is present, but not in the body', function(done) {
      postRoute('/42', null, fail, 3, done);
    });

    // POST only

    it('should return three errors when params are not present', function(done) {
      postRoute('/test?testparam=gettest', null, fail, 3, done);
    });

    it('should return three errors when param is present, but not in body', function(done) {
      postRoute('/42?testparam=42', null, fail, 3, done);
    });

    it('should return two errors when one param is present, but does not validate', function(done) {
      postRoute('/42?testparam=42', { testparam: 'posttest' }, fail, 2, done);
    });

    it('should return a success when params validate on the body', function(done) {
      postRoute('/?testparam=blah', { testparam: '42', arrayParam: [1, 2, 3] }, pass, null, done);
    });

    it('should return two errors when two params are present, but do not validate', function(done) {
      postRoute('/?testparam=42', { testparam: 'posttest', arrayParam: 123 }, fail, 2, done);
    });

    it('should return two errors when two params are present, but do not validate', function(done) {
      postRoute('/?testparam=42', { testparam: 'posttest', arrayParam: {} }, fail, 2, done);
    });

    it('should return two errors when two params are present, but do not validate', function(done) {
      postRoute('/', { testparam: 'test', arrayParam: '[]' }, fail, 2, done);
    });

    it('should return a success when params validate on the body', function(done) {
      postRoute('/', { testparam: '42', arrayParam: [] }, pass, null, done);
    });
  });
});
