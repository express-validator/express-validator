var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
var nameError = 'Enter your name';
var dobError = 'Enter your date of birth';
var parentError = 'Please answer the question';

function validation(req, res) {
  req.check('question', parentError).all([
    req.check('name', nameError).all([
      req.check('firstName', 'Enter your first name').notEmpty(),
      req.check('lastName', 'Enter your last name').notEmpty()
    ]),
    req.check('dob', dobError).all([
      req.check('day', 'Enter your day of birth').notEmpty(),
      req.check('month', 'Enter your month of birth').notEmpty(),
      req.check('year', 'Enter your year of birth').notEmpty()
    ])
  ]);

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.sendStatus(200);
}

function fail(params) {
  return function(res) {
    expect(res.body).to.have.length(1);
    if (typeof params === 'string') {
      params = [params];
    }
    params.forEach(function(param, idx) {
      expect(res.body[idx]).to.have.property('param', param);
    });
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

var fullBody = {
  firstName: 'John',
  lastName: 'Smith',
  day: '1',
  month: '12',
  year: '1988'
};

function except(keys) {
  if (typeof keys === 'string') {
    keys = [keys];
  }
  var body = Object.assign({}, fullBody);
  keys.forEach(function(key) {
    body[key] = undefined;
  });
  return body;
}

// This before() is required in each set of tests in
// order to use a new validation function in each file
before(function() {
  delete require.cache[require.resolve('./helpers/app')];
  app = require('./helpers/app')(validation);
});

describe('#all', function() {
  it('should return no errors if children pass', function(done) {
    postRoute(fullBody, pass, done);
  });

  ['firstName', 'lastName', 'day', 'month', 'year'].forEach(function(param) {
    it('should return the child error if ' + param + 'fail', function(done) {
      postRoute(except(param), fail(param), done);
    });
  });

  it('should return the middle error if children fail', function(done) {
    postRoute(except(['day', 'month', 'year']), fail('dob'), done);
  });

  it('should return the middle error if children fail', function(done) {
    postRoute(except(['firstName', 'lastName']), fail('name'), done);
  });

  it('should return the parent error if all children fail', function(done) {
    postRoute({}, fail('question'), done);
  });
});
