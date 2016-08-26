var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var parentError = 'Enter your name';

function validation(req, res) {
  req.check('name', parentError).all([
    req.check('firstName', 'Enter your first name').notEmpty(),
    req.check('lastName', 'Enter your last name').notEmpty()
  ]);

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.sendStatus(200);
}

function fail(param) {
  return function(res) {
    expect(res.body).to.have.length(1);
    expect(res.body[0]).to.have.property('param', param);
  };
}

function pass(res) {
  expect(res.status).to.eql(200);
}

function postRoute(data, test, done) {
  request(app)
    .post('/')
    .send(data)
    .end(function(err, res) {
      test(res);
      done();
    });
}

// This before() is required in each set of tests in
// order to use a new validation function in each file
before(function() {
  delete require.cache[require.resolve('./helpers/app')];
  app = require('./helpers/app')(validation);
});

describe('#all', function() {
  it('should return no errors if children pass', function(done) {
    postRoute({ firstName: 'John', lastName: 'Smith' }, pass, done);
  });

  it('should return the child error if some children fail', function(done) {
    postRoute({ firstName: 'John' }, fail('lastName'), done);
  });

  it('should return the child error if some children fail', function(done) {
    postRoute({ lastName: 'Smith' }, fail('firstName'), done);
  });

  it('should return the parent error if all children fail', function(done) {
    postRoute({}, fail('name'), done);
  });
});
