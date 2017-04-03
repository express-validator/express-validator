var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;

function validation(req, res) {
  req.checkBody('users.*.email', 'valid email required').isEmail();
  req.checkBody('users.*.accessRights.*', 'valid access rights required').isInt();
  req.checkBody(['users', '*', 'accessRights', 'execute'], 'execite rigths required').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send(req.body);
}

function testRoute(path, data, test, done) {
  request(app)
    .post(path)
    .send(data)
    .end(function (err, res) {
      test(res.body);
      done();
    });
}

// This before() is required in each set of tests in
// order to use a new validation function in each file
before(function () {
  delete require.cache[require.resolve('./helpers/app')];
  app = require('./helpers/app')(validation);
});

describe('wildcard array/object validation', function () {
  it('should return a success when the correct data is passed on the body', function (done) {
    var users = [
            { email: 'test1@mail.com', accessRights: { read: 0, write: 7, execute: 3 } },
            { email: 'test2@mail.com', accessRights: { read: 0, write: 7, execute: 3 } },
            { email: 'test3@mail.com', accessRights: { read: 0, write: 7, execute: 3 } },
            { email: 'test4@mail.com', accessRights: { read: 0, write: 7, execute: 3 } }
    ];
    var validateBody = function (body) {
      expect(body).to.have.a.property('users').eql(users);
    };

    testRoute('/', { users: users}, validateBody, done);
  });

  it('should return an error object with each failing param as a property when the data is invalid', function (done) {
    var badUsers = [
            { email: 'bad email', accessRights: { read: 0, write: 'the baddie', execute: 3 } },
            { email: 'test2@mail.com', accessRights: { read: 0, write: 7, execute: 3 } },
            { email: 'test3@mail.com', accessRights: { read: 0, write: 7, execute: 3 } },
            { email: 'test4@mail.com', accessRights: { read: 0, write: 3} }
    ];
    var checkErrors = function (body) {
      expect(body).to.eql([
            { param: 'users.0.email', msg: 'valid email required', value: 'bad email' },
            { param: 'users.0.accessRights.write', msg: 'valid access rights required', value: 'the baddie' },
            { param: 'users.3.accessRights.execute', msg: 'execite rigths required' }]
          );
    };

    testRoute('/', { users: badUsers }, checkErrors, done);
  });
});