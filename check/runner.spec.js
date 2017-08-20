const validator = require('validator');
const expect = require('chai').expect;
const runner = require('./runner');

describe('Validation context runner', () => {
  describe('validation errors', () => {
    it('contain the location, path, value and message', () => {
      const req = {
        params: { foo: 'not_email_params' },
        body: { foo: 'not_email_body' }
      };

      return runner(req, {
        fields: ['foo'],
        locations: ['params', 'body'],
        validators: [{
          options: [],
          validator: validator.isEmail
        }]
      }).then(errors => {
        expect(errors).to.deep.include({
          location: 'params',
          path: 'foo',
          value: 'not_email_params',
          message: 'Invalid value'
        });

        expect(errors).to.deep.include({
          location: 'body',
          path: 'foo',
          value: 'not_email_body',
          message: 'Invalid value'
        });
      });
    });
  });

  describe('error messages', () => {
    it('are by default "Invalid value"', () => {
      const req = {
        query: { foo: 'aa' }
      };

      return runner(req, {
        locations: ['query'],
        fields: ['foo'],
        validators: [{
          validator: validator.isInt,
          options: []
        }]
      }).then(errors => {
        expect(errors[0]).to.have.property('message', 'Invalid value');
      });
    });

    it('use validator\'s exception message', () => {
      const req = {
        query: { foo: 'foo' }
      };

      return runner(req, {
        locations: ['query'],
        fields: ['foo'],
        validators: [{
          validator: () => { throw new Error('wat'); },
          options: []
        }]
      }).then(errors => {
        expect(errors[0]).to.have.property('message', 'wat');
      });
    });

    it('are overwritten for the last validator by .withMessage() chain method', () => {
      const req = {
        query: { foo: 123, bar: 'not int' }
      };

      return runner(req, {
        locations: ['query'],
        fields: ['foo', 'bar'],
        validators: [{
          validator: validator.isInt,
          options: []
        }, {
          message: 'wut!',
          options: [],
          validator: () => { throw new Error('wat'); }
        }]
      }).then(errors => {
        expect(errors).to.deep.include({
          path: 'foo',
          value: 123,
          location: 'query',
          message: 'wut!'
        });

        expect(errors).to.deep.include({
          path: 'bar',
          value: 'not int',
          location: 'query',
          message: 'Invalid value'
        });

        expect(errors).to.deep.include({
          path: 'bar',
          value: 'not int',
          location: 'query',
          message: 'wut!'
        });
      });
    });
  });

  describe('validators', () => {
    it('receive value and request when is a custom', () => {
      const req = {
        body: { foo: 'wut', bar: '123', suffix: '4' }
      };

      return runner(req, {
        locations: ['body'],
        fields: ['foo', 'bar'],
        validators: [{
          custom: true,
          options: [],
          validator (value, req) {
            return /^\d+$/.test(value + req.body.suffix);
          }
        }]
      }).then(errors => {
        expect(errors)
          .to.have.length(1)
          .and.to.have.deep.property('[0].path', 'foo');
      });
    });

    it('receive value and options when is a default', () => {
      const req = {
        query: { withzero: '0123', withoutzero: '123' }
      };

      return runner(req, {
        fields: ['withzero', 'withoutzero'],
        locations: ['query'],
        validators: [{
          validator: validator.isInt,
          options: [{ allow_leading_zeroes: false }]
        }]
      }).then(errors => {
        expect(errors)
          .to.have.length(1)
          .and.to.have.deep.property('[0].path', 'withzero');
      });
    });
  });
});