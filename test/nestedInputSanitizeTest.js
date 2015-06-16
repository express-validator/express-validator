var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;
function validation(req, res) {
  req.sanitize(['user', 'fields', 'email']).trim();
  res.send( req.body );
}

function pass(body) {
  expect(body).to.have.deep.property('user.fields.email', 'test@example.com');
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

describe('#nestedInputSanitizers', function() {
  describe('POST tests', function() {

    it('should return property and sanitized value', function(done) {
      postRoute('/', { user: { fields: { email: '     test@example.com       ' } } }, pass, done);
    });

  });
});