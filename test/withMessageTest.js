var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMessage = 'Default error message';
var mustBeTwoDigitsMessage = 'testparam must have two digits';
var mustBeIntegerMessage = 'testparam must be an integer';

function validation(req, res) {
  req.checkParams('testparam', errorMessage)
    .notEmpty() // with default message
    .isInt().withMessage(mustBeIntegerMessage)
    .isInt() // with default message
    .isLength(2, 2).withMessage(mustBeTwoDigitsMessage);
  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send({ testparam: req.params.testparam });
}

function fail(expectedMessage) {
  if (Array.isArray(expectedMessage)) {
    return function(body, length) {
      expect(body).to.have.length(length);
      expect(expectedMessage).to.have.length(length);
      for (var i = 0; i < length; ++i) {
        expect(body[i]).to.have.property('msg', expectedMessage[i]);
      }
    };
  }
  return function(body, length) {
    expect(body).to.have.length(length);
    expect(body[0]).to.have.property('msg', expectedMessage);
  };
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

// This before() is required in each set of tests in
// order to use a new validation function in each file
before(function() {
  delete require.cache[require.resolve('./helpers/app')];
  app = require('./helpers/app')(validation);
});

describe('#withMessage()', function() {
    it('should return one error per validation failure, with custom message where defined', function(done) {
      getRoute('/test', fail([mustBeIntegerMessage, errorMessage, mustBeTwoDigitsMessage]), 3, done);
    });

    it('should return four errors when param is missing, with default message for the first and third errors, and custom messages for the rest, as defined', function(done) {
      getRoute('/', fail([errorMessage, mustBeIntegerMessage, errorMessage, mustBeTwoDigitsMessage]), 4, done);
    });

    it('should return a success when param validates', function(done) {
      getRoute('/42', pass, null, done);
    });

    it('should provide a custom message when an invalid value is provided, and the validation is followed by withMessage', function(done) {
      getRoute('/199', fail(mustBeTwoDigitsMessage), 1, done);
    });

    it('should update the error message only if the preceeding validation was the one to fail', function() {
      var validator = require('../lib/express_validator')();
      var req = {
        body: {
          testParam: 'abc'
        }
      };

      validator(req, {}, function() {});
      req.check('testParam', 'Default Error Message')
        .isInt() // should produce 'Default Error Message'
        .isLength(2).withMessage('Custom Error Message');

      expect(req.validationErrors()).to.deep.equal([
        { param: 'testParam', msg: 'Default Error Message', value: 'abc' }
      ]);
    });
});