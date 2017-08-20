const expect = require('chai').expect;
const expressValidator = require('..');

describe('Legacy: req.check()/req.assert()/req.validate()', () => {
  it('has all the aliases', () => {
    const req = {};
    expressValidator()(req, {}, () => {});

    expect(req.check).to.be.a('function');
    expect(req.assert).to.equal(req.check);
    expect(req.validate).to.equal(req.check);
  });

  it('checks req.query', () => {
    const req = {
      query: {
        required: '',
        email: 'foo@bar.com'
      }
    };

    expressValidator()(req, {}, () => {});
    req.check('required').notEmpty();
    req.check('email').isEmail();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.property('required');
      expect(result.mapped()).to.not.have.property('email');
    });
  });

  it('checks req.body', () => {
    const req = {
      body: {
        required: '',
        email: 'foo@bar.com'
      }
    };

    expressValidator()(req, {}, () => {});
    req.check('required').notEmpty();
    req.check('email').isEmail();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.property('required');
      expect(result.mapped()).to.not.have.property('email');
    });
  });

  it('checks req.params', () => {
    const req = {
      params: {
        int: '123',
        alpha: '456'
      }
    };

    expressValidator()(req, {}, () => {});
    req.check('int').isInt();
    req.check('alpha').isAlpha();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.not.have.property('int');
      expect(result.mapped()).to.have.property('alpha');
    });
  });

  it('does not check req.headers', () => {
    const req = {
      headers: { int: 'asd' }
    };

    expressValidator()(req, {}, () => {});
    req.check('int').optional().isInt();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.eql({});
    });
  });

  it('does not check req.cookies', () => {
    const req = {
      cookies: { int: 'asd' }
    };

    expressValidator()(req, {}, () => {});
    req.check('int').optional().isInt();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.eql({});
    });
  });

  it('checks req.params, then req.query, then req.body', () => {
    const req = {
      params: { int: '123' },
      query: { int: 'asd', alpha: 'asd' },
      body: { int: 'foo', alpha: '123', upper: 'BAR' }
    };

    expressValidator()(req, {}, () => {});
    req.check('int').isInt();
    req.check('alpha').isAlpha();
    req.check('upper').isUppercase();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.eql({});
    });
  });

  it('checks using nested paths', () => {
    const req = {
      params: {
        nested: { path: [ 'is@email.com', 'notemail.com' ] }
      }
    };

    expressValidator()(req, {}, () => {});
    req.check('nested.path[0]').isEmail();
    req.check('nested.path[1]').isEmail();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.not.have.property('nested.path[0]');
      expect(result.mapped()).to.have.property('nested.path[1]');
    });
  });
});