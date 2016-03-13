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

var schema = {
  testparam: {
    in: 'params',
    notEmpty: true,
      isInt: {
        errorMessage: errorMsg
      }
  },
  testquery: {
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
  },
  'numInQuery': {
    notEmpty: true,
    isInt: {
      options: [{
        min: 0,
        max: 665
      }],
      errorMessage: errorMsgOutOfRange
    }
  }
};

function validationSendResponse(req, res) {
  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }

  res.send({
    testparam: req.params.testparam,
    testquery: req.query.testquery,
    skipped: req.query.skipped,
    numInQuery: req.query.numInQuery
  });
}

function validation(req, res) {

  req.check(schema);
  validationSendResponse(req, res);
}

function validationQuery(req, res) {

  req.checkQuery(schema);
  validationSendResponse(req, res);
}

function validationParams(req, res) {

  req.checkParams(schema);
  validationSendResponse(req, res);
}

function validationBody(req, res) {

  req.checkBody(schema);
  validationSendResponse(req, res);
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
  expect(params).to.have.property('testquery', '6');
  expect(params).to.have.property('skipped', '34');
  expect(params).to.have.property('numInQuery', '0');
}

function failQueryParams(params, length) {
  expect(params).to.have.length(length);
  expect(params[0]).to.have.property('msg', 'Invalid param');
  expect(params[1]).to.have.property('msg', errorMsgOutOfRange);
}

function getRoute(path, test, length, done) {
  request(app)
    .get(path)
    .end(function(err, res) {
      test(res.body, length);
      done();
    });
}

describe('Check defining validator location inside schema validators', function() {

  // This before() is required in each set of tests in
  // order to use a new validation function in each file
  before(function() {
    delete require.cache[require.resolve('./helpers/app')];
    app = require('./helpers/app')(validation);
  });

  it('should validate against schema with query and params locations', function(done) {
    getRoute('/25?testquery=6&skipped=34&numInQuery=0', pass, 1, done);
  });

  it('should fail when param is not integer', function(done) {
    getRoute('/ImNot?testquery=6&skipped=34&numInQuery=0', failParams, 1, done);
  });

  it('should fail when query param is out of range', function(done) {
    getRoute('/25?testquery=20&skipped=34&numInQuery=0', failQuery, 1, done);
  });

  it('should fail when non of params are valid', function(done) {
    getRoute('/ImNot?testquery=20&skipped=34&numInQuery=0', failAll, 2, done);
  });

});

describe('Check defining validator location inside schema validators by checkQuery()', function() {

  // This before() is required in each set of tests in
  // order to use a new validation function in each file
  before(function() {
    delete require.cache[require.resolve('./helpers/app')];
    app = require('./helpers/app')(validationQuery);
  });

  it('should validate against schema with query and params locations', function(done) {
    getRoute('/25?testquery=6&skipped=34&numInQuery=0', pass, 1, done);
  });

  it('should fail when query param is out of range', function(done) {
    getRoute('/25?testquery=6&skipped=34&numInQuery=666', failQuery, 1, done);
  });

});

describe('Check defining validator location inside schema validators by checkParams()', function() {

  // This before() is required in each set of tests in
  // order to use a new validation function in each file
  before(function() {
    delete require.cache[require.resolve('./helpers/app')];
    app = require('./helpers/app')(validationParams);
  });

  it('should fail when searching for query param in the path params', function(done) {
    getRoute('/25?testquery=6&skipped=34&numInQuery=666', failQueryParams, 2, done);
  });

});

describe('Check defining validator location inside schema validators by checkBody()', function() {

  // This before() is required in each set of tests in
  // order to use a new validation function in each file
  before(function() {
    delete require.cache[require.resolve('./helpers/app')];
    app = require('./helpers/app')(validationBody);
  });

  it('should fail when searching for query param in the body', function(done) {
    getRoute('/25?testquery=6&skipped=34&numInQuery=666', failQueryParams, 2, done);
  });

});
