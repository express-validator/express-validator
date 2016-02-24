var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMsg = 'Parameter is not an integer.';
var errorMsgOutOfRange = 'Parameter is out of range or not int.';

// There are three ways to pass parameters to express:
// - as part of the URL
// - as GET parameter in the querystring
// - as POST parameter in the body
// These test show that req.checkParams are only interested in req.params values, all other
// parameters will be ignored.

function validation(req, res) {
  req.check({
    'testparam': {
      in: 'params',
      notEmpty: true,
      isInt: {
        errorMessage: errorMsg
      }
    },
    'testquery': {
      in: 'query',
      notEmpty: true,
      isInt: {
        options: [{
          min: 2,
          max: 10
        }],
        errorMessage: errorMsgOutOfRange
      }
    },
    'skipped': {
      // this validator is a fake validator which cannot raise any error, should be always skipped
      in: 'notSupportedOne',
      notEmpty: true,
      isInt: {
        options: [{
          min: 2,
          max: 10
        }],
        errorMessage: errorMsgOutOfRange
      }
    }
  });

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send({
    testparam: req.params.testparam,
    testquery: req.params.testquery
  });
}

function failParams(body, length) {
  expect(body).to.have.length(length);
  expect(body[0]).to.have.property('msg', errorMsg);
}

function failQuery(body, length) {
  expect(body).to.have.length(length);
  expect(body[0]).to.have.property('msg', errorMsgOutOfRange);
}

function failAll(body, length) {
  expect(body).to.have.length(length);
  expect(body[0]).to.have.property('msg', errorMsg);
  expect(body[1]).to.have.property('msg', errorMsgOutOfRange);
}

function pass(params) {
  expect(params).to.have.property('testparam', '25');
}

function getRoute(path, test, length, done) {
  request(app)
    .get(path)
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

describe('Check defining validator location inside schema validators', function() {

  it('should validate against schema with query and params locations', function(done) {
    getRoute('/25?testquery=6', pass, 1, done);
  });

  it('should fail when param is not integer', function(done) {
    getRoute('/ImNot?testquery=6', failParams, 1, done);
  });

  it('should fail when query param is out of range', function(done) {
    getRoute('/25?testquery=20', failQuery, 1, done);
  });

  it('should fail when non of params are valid', function(done) {
    getRoute('/ImNot?testquery=20', failAll, 2, done);
  });

});
