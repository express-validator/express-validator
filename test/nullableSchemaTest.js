var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMessage = 'Parameter is not an integer';

function validation(req, res) {
  req.assert({
    'nullable_param': {
      isInt: {
        errorMessage: errorMessage
      },
      nullable: true
    }
  });
  req.assert({
    'optional_nullable_param': {
      isInt: {
        errorMessage: errorMessage
      },
      optional: true,
      nullable: true
    }
  });
  req.assert({
    'nullable_optional_param': {
      isInt: {
        errorMessage: errorMessage
      },
      nullable: true,
      optional: true
    }
  });

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send({ result: 'OK' });
}

function fail(body) {
  expect(body).to.have.length(1);
  expect(body[0]).to.have.property('msg', errorMessage);
}

function pass(body) {
  expect(body).to.have.property('result', 'OK');
}

function testQuery(path, test, done) {
  request(app)
    .get(path)
    .end(function(err, res) {
      test(res.body);
      done();
    });
}

function testBody(body, test, done) {
  request(app)
    .post('/path')
    .send(body)
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

describe('#nullableSchema()', function() {

  describe('with #optionalSchema()', function() {
    it('should return a success when optional params are not provided', function(done) {
      testBody({ nullable_param: null }, pass, done);
    });
    it('should return a success when #optional() called before #nullable()', function(done) {
      testBody({ nullable_param: null, optional_nullable_param: null }, pass, done);
    });
    it('should return a success when #optional() called after #nullable()', function(done) {
      testBody({ nullable_param: null, nullable_optional_param: null }, pass, done);
    });
  });

  describe('query', function() {
    it('should return an error when there is an empty route', function(done) {
      testQuery('/', fail, done);
    });

    it('should return an error when there are no params on a route', function(done) {
      testQuery('/path', fail, done);
    });

    it('should return an error when the non-nullable param is present', function(done) {
      testQuery('/path?other_param=test', fail, done);
    });

    it('should return an error when param is provided, but empty', function(done) {
      testQuery('/path?nullable_param', fail, done);
    });

    it('should return an error when param is provided with equals sign, but empty', function(done) {
      testQuery('/path?nullable_param=', fail, done);
    });

    it('should return an error when param is provided, but fails validation', function(done) {
      testQuery('/path?nullable_param=test', fail, done);
    });

    it('should return a success when param is provided and validated', function(done) {
      testQuery('/path?nullable_param=123', pass, done);
    });

    it('should return an error when param is "null"', function(done) {
      // there is no way to receive null in query
      testQuery('/path?nullable_param=null', fail, done);
    });
  });

  describe('body', function() {
    it('should return an error when body in null', function(done) {
      testBody(null, fail, done);
    });

    it('should return an error when there is an empty body', function(done) {
      testBody({}, fail, done);
    });

    it('should return an error when the non-nullable param is present', function(done) {
      testBody({ other_param: 'test' }, fail, done);
    });

    it('should return an error when param is provided, but undefined', function(done) {
      testBody({ nullable_param: undefined }, fail, done);
    });

    it('should return an error when param is provided, but fails validation', function(done) {
      testBody({ nullable_param: 'test' }, fail, done);
    });

    it('should return a success when param is provided and validated', function(done) {
      testBody({ nullable_param: 123 }, pass, done);
    });

    it('should return a success when param is null', function(done) {
      testBody({ nullable_param: null }, pass, done);
    });
  });

});
