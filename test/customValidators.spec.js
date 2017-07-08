const { expect } = require('chai');
const expressValidator = require('..');

describe('Custom validators', () => {
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
        usernameAvailable: value => Promise.reject()
      }
    })(req, {}, () => {});

    req.check('username').usernameAvailable().withMessage('username taken');

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.have.deep.property('username.msg', 'username taken');
    });
  });
});