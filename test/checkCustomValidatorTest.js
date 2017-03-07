var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var errorMsg = 'Parameter does not equal';

var schema = {
  testparam: {
    in: 'params',
    isEqualTo: { 
      options: function(obj) {
        const req = obj.req;
        return req.params.otherParam;
      },
      errorMessage: errorMsg
    }
  },
  testheader: {
    in: 'headers',
    isEqualTo: { 
      options: function(obj) {
        const req = obj.req;
        return req.headers.otherheader;
      },
      errorMessage: errorMsg
    }
  },
  testquery: {
    in: 'query',
    isEqualTo: { 
      options: function(obj) {
        const req = obj.req;
        return req.query.otherQuery;
      },
      errorMessage: errorMsg
    }
  }
};

function getRoute(path, headers, test, done) {
  request(app)
    .get(path)
    .set(headers || {})
    .end(function(err, res) {
      test(res.body);
      done();
    });
}

function validationSendResponse(req, res) {
  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }

  res.send({
    testheader: req.headers.testheader,
    testparam: req.params.testparam,
    testquery: req.query.testquery,
    skipped: req.query.skipped,
    numInQuery: req.query.numInQuery
  });
}


function validationQuery(req, res) {
  req.checkQuery(schema);
  validationSendResponse(req, res);
}

describe('Check defining validator as a function with access to the req object', function() {

  // This before() is required in each set of tests in
  // order to use a new validation function in each file
  before(function() {
    delete require.cache[require.resolve('./helpers/app')];
    app = require('./helpers/app')(validationQuery);
  });

  describe('query', function() {

    it('passes with parameters matching', function(done) {
      getRoute(
        '/not_matched?testquery=boyOhboy&otherQuery=boyOhboy', 
        { testheader: 'not_matched' }, function(body) {
          expect(body).to.have.length(2);
          expect(body[0]).to.have.property('param', 'testparam');
          expect(body[1]).to.have.property('param', 'testheader');
        }, done);
    });

      it('fails with parameters not matching', function(done) {
      getRoute(
        '/not_matched?testquery=boyOhboy&otherQuery=not_matching',
        { testheader: 'not_matched' }, function(body) {
          expect(body).to.have.length(3);
          expect(body[0]).to.have.property('param', 'testparam');
          expect(body[1]).to.have.property('param', 'testheader');
          expect(body[2]).to.have.property('param', 'testquery');
        }, done);
    });
  });

  describe('parameters', function() {

    it('passes with parameters matching', function(done) {
      getRoute(
        '/boyOhBoy/boyOhBoy?testquery=boyOhboy&otherQuery=not_matched', 
        { testheader: 'not_matched' }, function(body) {
          expect(body).to.have.length(2);
          expect(body[0]).to.have.property('param', 'testheader');
          expect(body[1]).to.have.property('param', 'testquery');
        }, done);
    });

      it('fails with parameters not matching', function(done) {
      getRoute(
        '/boyOhBoy/not_matching?testquery=boyOhboy&otherQuery=not_matched', 
        { testheader: 'not_matched' }, function(body) {
          expect(body).to.have.length(3);
          expect(body[0]).to.have.property('param', 'testparam');
          expect(body[1]).to.have.property('param', 'testheader');
          expect(body[2]).to.have.property('param', 'testquery');
        }, done);
    });
  });

  describe('headers', function() {

    it('passes with parameters matching', function(done) {
      getRoute(
        '/not_matching?testquery=boyOhboy&otherQuery=not_matched', 
        { testheader: 'oneHeader', otherheader: 'oneHeader' }, function(body) {
          expect(body).to.have.length(2);
          expect(body[0]).to.have.property('param', 'testparam');
          expect(body[1]).to.have.property('param', 'testquery');
        }, done);
    });

      it('fails with parameters not matching', function(done) {
      getRoute(
        '/not_matching?testquery=boyOhboy&otherQuery=not_matched', 
        { testheader: 'oneHeader', otherheader: 'somethingelse' }, function(body) {
          expect(body).to.have.length(3);
          expect(body[0]).to.have.property('param', 'testparam');
          expect(body[1]).to.have.property('param', 'testheader');
          expect(body[2]).to.have.property('param', 'testquery');
        }, done);
    });
  });

})
