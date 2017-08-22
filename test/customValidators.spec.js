const expect = require('chai').expect;
const expressValidator = require('..');

describe('Legacy: Custom validators', () => {
  it('exist in the validator chain', () => {
    const req = {};
    expressValidator({
      customValidators: {
        isFoo: () => true
      }
    })(req, {}, () => {});

    expect(req.check('foo').isFoo).to.be.a('function');
  });

  it('receive the value and additional args', () => {
    const req = {
      body: {
        twoWords: 'two words',
        threeWords: 'three words?'
      }
    };

    expressValidator({
      customValidators: {
        containsWords: (value, number) => value.split(' ').length === number
      }
    })(req, {}, () => {});

    req.check('twoWords').containsWords(2);
    req.check('threeWords').containsWords(3);

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.not.have.property('twoWords');
      expect(result.mapped()).to.have.property('threeWords');
    });
  });

  it('are appended to existing custom validators built by another middleware instance on the same app', () => {
    const req = {};
    expressValidator({
      customValidators: {
        isFoo: () => true
      }
    })(req, {}, () => {});

    expressValidator({
      customValidators: {
        isBar: () => true
      }
    })(req, {}, () => {});

    expect(req.check('foo')).to.have.property('isFoo').and.to.be.a('function');
    expect(req.check('foo')).to.have.property('isBar').and.to.be.a('function');
  });

  it('are not shared across apps', () => {
    const req1 = {};
    expressValidator({
      customValidators: {
        isFoo: () => true
      }
    })(req1, {}, () => {});

    const req2 = {};
    expressValidator({
      customValidators: {
        isBar: () => true
      }
    })(req2, {}, () => {});

    expect(req2.check('foo').isFoo).to.not.exist;
    expect(req1.check('bar').isBar).to.not.exist;
  });

  it('work asynchronously', () => {
    const req = {
      body: { username: 'george' }
    };

    expressValidator({
      customValidators: {
        usernameAvailable: () => Promise.reject()
      }
    })(req, {}, () => {});

    req.check('username').usernameAvailable().withMessage('username taken');

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.deep.property('username.msg', 'username taken');
    });
  });

  it('work with schemas', () => {
    const req = {
      body: { foo: 'foo', foo2: 'FoO', foo3: 'bar!' }
    };

    expressValidator({
      customValidators: {
        isFoo: (val, options) => {
          const checkedVal = options && options.caseInsensitive ? val.toLowerCase() : val;
          return checkedVal === 'foo';
        }
      }
    })(req, {}, () => {});

    req.check({
      foo: { isFoo: true },
      foo2: {
        isFoo: {
          options: { caseInsensitive: true }
        }
      },
      foo3: { isFoo: true }
    });

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.not.have.property('foo');
      expect(result.mapped()).to.not.have.property('foo2');
      expect(result.mapped()).to.have.property('foo3');
    });
  });
});