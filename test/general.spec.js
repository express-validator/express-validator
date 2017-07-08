const { expect } = require('chai');
const expressValidator = require('..');

describe('General', () => {
  it('does not throw if validator returns nil', () => {
    const req = {
      body: { foo: 'bar' }
    };

    expressValidator({
      customValidators: {
        testNull: () => null,
        testUndefined: () => undefined
      }
    })(req, {}, () => {});

    const testNull = () => req.check('foo').testNull();
    const testUndefined = () => req.check('foo').testNull();

    expect(testNull).to.not.throw();
    expect(testUndefined).to.not.throw();

    return req.getValidationResult().then(result => {
      expect(result.array()).to.have.lengthOf(2);
    });
  });

  describe('req.validationErrors()', () => {
    it('returns an array of all sync errors', () => {
      const req = {
        params: {
          int: '123',
          alpha: '456'
        }
      };

      expressValidator()(req, {}, () => {});
      req.check('int').isInt();
      req.check('alpha').isAlpha().isLength({ min: 4 });

      const errors = req.validationErrors();
      expect(errors).to.have.lengthOf(2);
    });

    it('returns an object of the last sync error of each key if mapped = true', () => {
      const req = {
        params: {
          int: '123',
          alpha: '456'
        }
      };

      expressValidator()(req, {}, () => {});
      req.check('int').isInt();
      req.check('alpha')
        .isAlpha().withMessage('should be alpha only')
        .isLength({ min: 4 }).withMessage('taken');

      const errors = req.validationErrors(true);
      expect(errors).to.not.have.property('int');
      expect(errors).to.have.deep.property('alpha.msg', 'taken');
    });
  });

  describe('req.asyncValidationErrors()', () => {
    it('rejects promise with an array of all sync errors + async errors', () => {
      const req = {
        params: {
          int: '123',
          alpha: '456'
        }
      };

      expressValidator({
        customValidators: {
          available: value => Promise.reject()
        }
      })(req, {}, () => {});

      req.check('int').isInt();
      req.check('alpha').isAlpha().available();

      return req.asyncValidationErrors().then(() => {
        throw new Error('validation passed (but it should not)');
      }, errors => {
        expect(errors).to.have.lengthOf(2);
      });
    });

    it('rejects promise with an object of the last (a)sync error of each key if mapped = true', () => {
      const req = {
        params: {
          int: '123',
          alpha: '456'
        }
      };

      expressValidator({
        customValidators: {
          available: value => Promise.reject()
        }
      })(req, {}, () => {});

      req.check('int').isInt();
      req.check('alpha')
        .isAlpha().withMessage('should be alpha only')
        .available().withMessage('taken');

      return req.asyncValidationErrors(true).then(() => {
        throw new Error('validation passed (but it should not)');
      }, errors => {
        expect(errors).to.not.have.property('int');
        expect(errors).to.have.deep.property('alpha.msg', 'taken');
      });
    });

    it('resolves promise in case no errors exist', () => {
      const req = {};
      expressValidator()(req, {}, () => {});

      return req.asyncValidationErrors();
    });
  });

  describe('req.getValidationResult()', () => {
    it('returns last error of each key as object with .mapped()', () => {
      const req = {
        params: {
          int: '123',
          alpha: '456'
        }
      };

      expressValidator()(req, {}, () => {});
      req.check('int').isInt();
      req.check('alpha')
        .isAlpha().withMessage('should be alpha only')
        .isLength({ min: 4 }).withMessage('min length is 4');

      return req.getValidationResult().then(result => {
        expect(result.mapped()).to.not.have.property('int');
        expect(result.mapped()).to.have.deep.property('alpha.msg', 'min length is 4');
      });
    });

    it('returns first error of each key as object with .useFirstErrorOnly().mapped()', () => {
      const req = {
        params: {
          int: '123',
          alpha: '456'
        }
      };

      expressValidator()(req, {}, () => {});
      req.check('int').isInt();
      req.check('alpha')
        .isAlpha().withMessage('should be alpha only')
        .isLength({ min: 4 }).withMessage('min length is 4');

      return req.getValidationResult().then(result => {
        result.useFirstErrorOnly();

        expect(result.mapped()).to.not.have.property('int');
        expect(result.mapped()).to.have.deep.property('alpha.msg', 'should be alpha only');
      });
    });

    it('returns all errors as array with .array()', () => {
      const req = {
        params: {
          int: '123',
          alpha: '456'
        }
      };

      expressValidator()(req, {}, () => {});
      req.check('int').isInt();
      req.check('alpha').isAlpha().isLength({ min: 4 });

      return req.getValidationResult().then(result => {
        expect(result.array()).to.have.lengthOf(2);
      });
    });

    it('returns first error of each key as array with .useFirstErrorOnly().array()', () => {
      const req = {
        params: {
          int: '123',
          alpha: '456'
        }
      };

      expressValidator()(req, {}, () => {});
      req.check('int').isInt();
      req.check('alpha').isAlpha().isLength({ min: 4 });

      return req.getValidationResult().then(result => {
        result.useFirstErrorOnly();
        expect(result.array()).to.have.lengthOf(1);
      });
    });

    describe('.isEmpty()', () => {
      it('returns false if there are errors', () => {
        const req = {
          params: { alpha: '456' }
        };

        expressValidator()(req, {}, () => {});
        req.check('alpha').isAlpha();

        return req.getValidationResult().then(result => {
          expect(result.isEmpty()).to.be.false;
        });
      });

      it('returns true if there are no errors', () => {
        const req = {
          params: { int: '123' }
        };

        expressValidator()(req, {}, () => {});
        req.check('int').isInt();

        return req.getValidationResult().then(result => {
          expect(result.isEmpty()).to.be.true;
        });
      });
    });

    describe('.throw()', () => {
      it('throws error if there is any error', () => {
        const req = {
          params: { alpha: '456' }
        };

        expressValidator()(req, {}, () => {});
        req.check('alpha').isAlpha();

        return req.getValidationResult().then(result => {
          expect(result.throw).to.throw(Error);
        });
      });

      it('does not throw error if there is no error', () => {
        const req = {
          params: { int: '123' }
        };

        expressValidator()(req, {}, () => {});
        req.check('int').isInt();

        return req.getValidationResult().then(result => {
          expect(result.throw).to.not.throw();
        });
      });
    });
  });
});