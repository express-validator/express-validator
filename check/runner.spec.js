const validator = require('validator');
const expect = require('chai').expect;
const runner = require('./runner');

describe('check: context runner', () => {
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
          param: 'foo',
          value: 'not_email_params',
          msg: 'Invalid value'
        });

        expect(errors).to.deep.include({
          location: 'body',
          param: 'foo',
          value: 'not_email_body',
          msg: 'Invalid value'
        });
      });
    });

    it('are not pushed in case negated flag is set to true, and no error was thrown', () => {
      const req = {
        params: { foo: 'not_email' }
      };

      return runner(req, {
        fields: ['foo'],
        locations: ['params'],
        validators: [{
          options: [],
          negated: true,
          validator: validator.isEmail
        }, {
          options: [],
          negated: true,
          custom: true,
          validator() {
            throw new Error('wat');
          }
        }]
      }).then(errors => {
        expect(errors).to.have.length(1);
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
        expect(errors[0]).to.have.property('msg', 'Invalid value');
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
        expect(errors[0]).to.have.property('msg', 'wat');
      });
    });

    it('use validator\'s rejection cause as message', () => {
      const req = {
        query: { foo: 'foo' }
      };

      return runner(req, {
        locations: ['query'],
        fields: ['foo'],
        validators: [{
          options: [],
          validator: () => Promise.reject('wat-a-wat!')
        }]
      }).then(errors => {
        expect(errors[0]).to.have.property('msg', 'wat-a-wat!');
      });
    });

    it('use context\'s message', () => {
      const req = {
        query: { foo: 'foo' }
      };

      return runner(req, {
        message: 'wawat',
        locations: ['query'],
        fields: ['foo'],
        validators: [{
          validator: () => false,
          options: []
        }]
      }).then(errors => {
        expect(errors[0]).to.have.property('msg', 'wawat');
      });
    });

    it('are overwritten via custom validator message', () => {
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
          param: 'foo',
          value: 123,
          location: 'query',
          msg: 'wut!'
        });

        expect(errors).to.deep.include({
          param: 'bar',
          value: 'not int',
          location: 'query',
          msg: 'Invalid value'
        });

        expect(errors).to.deep.include({
          param: 'bar',
          value: 'not int',
          location: 'query',
          msg: 'wut!'
        });
      });
    });
  });

  describe('default validators', () => {
    it('receive result of value\'s .toString() method call when object', () => {
      const req = {
        body: { foo: {} }
      };

      return runner(req, {
        locations: ['body'],
        fields: ['foo'],
        validators: [{
          options: [],
          validator: value => Promise.reject(value)
        }]
      }).then(errors => {
        expect(errors[0].msg).to.equal(req.body.foo.toString());
      });
    });

    it('receive empty string when value is NaN, null, undefined or length == 0', () => {
      const req = {
        body: { foo: [], bar: undefined, baz: null, qux: NaN }
      };

      return runner(req, {
        locations: ['body'],
        fields: ['foo', 'bar', 'baz', 'qux'],
        validators: [{
          options: [],
          validator: value => Promise.reject(value)
        }]
      }).then(errors => {
        expect(errors[0].msg).to.equal('');
        expect(errors[1].msg).to.equal('');
        expect(errors[2].msg).to.equal('');
        expect(errors[3].msg).to.equal('');
      });
    });

    it('receive string representation when value is number', () => {
      const req = {
        body: { foo: 123 }
      };

      return runner(req, {
        locations: ['body'],
        fields: ['foo'],
        validators: [{
          options: [],
          validator: value => Promise.reject(value)
        }]
      }).then(errors => {
        expect(errors[0].msg).to.equal('123');
      });
    });

    it('receive string representation when value is boolean', () => {
      const req = {
        body: { foo: true, bar: false }
      };

      return runner(req, {
        locations: ['body'],
        fields: ['foo', 'bar'],
        validators: [{
          options: [],
          validator: value => Promise.reject(value)
        }]
      }).then(errors => {
        expect(errors[0].msg).to.equal('true');
        expect(errors[1].msg).to.equal('false');
      });
    });

    it('receive the value itself when it is string', () => {
      const req = {
        body: { foo: 'bar' }
      };

      return runner(req, {
        locations: ['body'],
        fields: ['foo'],
        validators: [{
          options: [],
          validator: value => Promise.reject(value)
        }]
      }).then(errors => {
        expect(errors[0].msg).to.equal('bar');
      });
    });
  });

  describe('validators', () => {
    it('receive value, request, location and path when is a custom', () => {
      const req = {
        body: { foo: ['wut'], bar: '123' }
      };

      return runner(req, {
        locations: ['body'],
        fields: ['foo[0]'],
        validators: [{
          custom: true,
          options: [],
          validator(value, { req, location, path }) {
            throw new Error([value, req.body.bar, location, path].join(' '));
          }
        }]
      }).then(errors => {
        expect(errors)
          .to.have.length(1)
          .and.to.have.deep.property('[0].msg', 'wut 123 body foo[0]');
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
          .and.to.have.deep.property('[0].param', 'withzero');
      });
    });

    it('are run serially', () => {
      let execution1, execution2;
      const req = {
        params: { foo: 'bar' }
      };

      return runner(req, {
        fields: ['foo'],
        locations: ['params'],
        validators: [{
          options: [],
          validator: () => {
            return new Promise(resolve => {
              execution1 = new Date();
              setTimeout(() => resolve(true), 10);
            });
          }
        }, {
          options: [],
          validator: () => {
            execution2 = new Date();
            return true;
          }
        }]
      }).then(() => {
        expect(execution1).to.be.lt(execution2);
      });
    });
  });
});