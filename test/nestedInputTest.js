var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;

function validation(req, res) {
  req.assert(['user', 'fields', 'email'], 'not empty').notEmpty();
  req.assert('user.fields.email', 'not empty').notEmpty();
  req.assert(['user', 'fields', 'email'], 'valid email required').isEmail();
  req.assert(['admins', '0', 'name'], 'must only contain letters').isAlpha();

  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }
  res.send(req.body);
}

function fail(body) {
  expect(body[0]).to.have.property('msg', 'not empty');
  expect(body[1]).to.have.property('msg', 'not empty');
  expect(body[2]).to.have.property('msg', 'valid email required');

  // Should convert ['user', 'fields', 'email'] to 'user.fields.email'
  // when formatting the error output
  expect(body[0]).to.have.property('param').and.to.be.a('string');
  expect(body[1]).to.have.property('param').and.to.be.a('string');
  expect(body[2]).to.have.property('param').and.to.be.a('string');
}

function pass(body) {
  expect(body).to.have.deep.property('user.fields.email', 'test@example.com');
}

function testRoute(path, data, test, done) {
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

describe('nested input as array or dot notation', function() {
  it('should return a success when the correct data is passed on the body', function(done) {
    testRoute('/', { user: { fields: { email: 'test@example.com' } }, admins: [{ name: 'Bobby' }] }, pass, done);
  });

  it('should return an error object with each failing param as a property data is invalid', function(done) {
    testRoute('/', { user: { fields: { email: '' } }, admins: [{ name: 0 }] }, fail, done);
  });
});