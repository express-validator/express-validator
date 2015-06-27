var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
function validation(req, res) {
  req.sanitize('zerotest').toString();
  req.sanitize('emptystrtest').toBoolean();
  req.sanitize('falsetest').toString();
  req.sanitize('testparam').whitelist(['a', 'b', 'c']);
  res.send({ params: req.params, query: req.query, body: req.body });
}

function pass(body) {
  if (Object.keys(body.params).length) {
    expect(body).to.have.deep.property('params.testparam', 'abc');
  }

  if (Object.keys(body.query).length) {
    expect(body).to.have.deep.property('query.testparam', 'abc');
  }

  if (Object.keys(body.body).length) {
    expect(body).to.have.deep.property('body.testparam', 'abc');
  }

  if (body.body.hasOwnProperty('zerotest')) {
    expect(body).to.have.deep.property('body.zerotest', '0');
  }

  if (body.body.hasOwnProperty('emptystrtest')) {
    expect(body).to.have.deep.property('body.emptystrtest', false);
  }

  if (body.body.hasOwnProperty('falsetest')) {
    expect(body).to.have.deep.property('body.falsetest', 'false');
  }

}

function fail(body) {
  expect(body).not.to.have.deep.property('params.testparam');
  expect(body).not.to.have.deep.property('query.testparam');
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

describe('#sanitizers', function() {
  describe('GET tests', function() {
    it('should return property and sanitized value when param is present', function(done) {
      getRoute('/abcdef', pass, done);
    });
    it('should not return property when query and param is missing', function(done) {
      getRoute('/', fail, done);
    });

    it('should return both query and param and sanitized values when they are both present', function(done) {
      getRoute('/abcdef?testparam=abcdef', pass, done);
    });

  });
  describe('POST tests', function() {
    it('should return property and sanitized value when param is present', function(done) {
      postRoute('/abcdef', null, pass, done);
    });

    it('should return both query and param and sanitized values when they are both present', function(done) {
      postRoute('/abcdef?testparam=abcdef', { testparam: '    abcdef     ' }, pass, done);
    });

    it('should return property and sanitized value when body is present', function(done) {
      postRoute('/', { testparam: '     abcdef     ' }, pass, done);
    });

    it('should return properly sanitized values even if the original value is falsey, but not null/undefined', function(done) {
      postRoute('/', { testparam: '     abcdef     ', zerotest: 0, emptystrtest: '', falsetest: false }, pass, done);
    });

  });
});
