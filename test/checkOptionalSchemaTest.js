var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app;

var optionalBodyErr = 'Invalid optional_body';
var requiredBodyErr = 'Invalid required_body';

var optionalBodyValue = 11;
var requiredBodyValue = 22;

var invalidOptionalBodyValue = 'aa';
var invalidRequiredBodyValue = 'bb';

var schema = {
	optional_body: {
		optional: true,
		isInt: true,
		errorMessage: optionalBodyErr
	},
	required_body: {
		isInt: true,
		errorMessage: requiredBodyErr
	}
};

var validAll = {
	optional_body: optionalBodyValue,
	required_body: requiredBodyValue
};

var validRequired = {
	required_body: requiredBodyValue
};

var validOptional = {
	optional_body: optionalBodyValue
};

var invalidAll = {
	optional_body: invalidOptionalBodyValue,
	required_body: invalidRequiredBodyValue
};

var invalidRequired = {
	optional_body: optionalBodyValue,
	required_body: invalidRequiredBodyValue
};

var invalidRequiredOnly = {
	required_body: invalidRequiredBodyValue
};

var invalidOptional = {
	optional_body: invalidOptionalBodyValue,
	required_body: requiredBodyValue
};

var invalidOptionalOnly = {
	optional_body: invalidOptionalBodyValue
};

function validationSendResponse(req, res) {
  var errors = req.validationErrors();
  if (errors) {
    return res.send(errors);
  }

  res.send({
    optional_body: req.body.optional_body,
    required_body: req.body.required_body
  });
}

function validation(req, res) {

  req.check(schema);
  validationSendResponse(req, res);
}

function passAll(body) {

	expect(body).to.have.property('optional_body', optionalBodyValue);
	expect(body).to.have.property('required_body', requiredBodyValue);
}

function passRequired(body) {

	expect(body).to.have.property('required_body', requiredBodyValue);
	expect(body).to.not.have.property('optional_body');
}

function failAll(body) {

	expect(body).to.deep.include({ msg: optionalBodyErr, param: 'optional_body', value: invalidOptionalBodyValue });
	expect(body).to.deep.include({ msg: requiredBodyErr, param: 'required_body', value: invalidRequiredBodyValue });
}

function failRequired(body) {

	expect(body).to.deep.include({ msg: requiredBodyErr, param: 'required_body', value: invalidRequiredBodyValue });
}

function failOptional(body) {

	expect(body).to.deep.include({ msg: optionalBodyErr, param: 'optional_body', value: invalidOptionalBodyValue });
}

function failUndefinedRequired(body) {

	expect(body).to.deep.include({ msg: requiredBodyErr, param: 'required_body' });
}

function failUndefinedRequiredInvalidOptional(body) {

	expect(body).to.deep.include({ msg: requiredBodyErr, param: 'required_body' });
	expect(body).to.deep.include({ msg: optionalBodyErr, param: 'optional_body', value: invalidOptionalBodyValue });
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

describe('Check with optional validators in schema', function() {
	it('should pass validation with all parameters sent', function(done) {
		postRoute('/', validAll, passAll, done);
	});

	it('should pass validation with only required parameter sent', function(done) {
		postRoute('/', validRequired, passRequired, done);
	});

	it('should fail validation with all invalid parameters sent', function(done) {
		postRoute('/', invalidAll, failAll, done);
	});

	it('should fail validation with invalid required parameter sent', function(done) {
		postRoute('/', invalidRequired, failRequired, done);
	});

	it('should fail validation with only invalid parameter', function(done) {
		postRoute('/', invalidRequiredOnly, failRequired, done);
	});

	it('should fail validation with invalid optional parameter sent', function(done) {
		postRoute('/', invalidOptional, failOptional, done);
	});

	it('should fail validation with only valid optional parameter sent', function(done) {
		postRoute('/', validOptional, failUndefinedRequired, done);
	});

	it('should fail validation with only invalid optional parameter sent', function(done) {
		postRoute('/', invalidOptionalOnly, failUndefinedRequiredInvalidOptional, done);
	});
});


