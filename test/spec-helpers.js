const expect = require('chai').expect;
const expressValidator = require('..');

exports.checkObjectSpec = checkedObject => {
  const reqObjects = ['body', 'cookies', 'query', 'params', 'headers'];
  const methodName = 'check' + checkedObject[0].toUpperCase() + checkedObject.substr(1);

  reqObjects.filter(obj => obj !== checkedObject).forEach(obj => {
    it('does not check req.' + obj, () => {
      const req = {};
      req[obj] = { int: 'asd' };

      expressValidator()(req, {}, () => {});
      req[methodName]('int').optional().isInt();

      return req.getValidationResult().then(result => {
        expect(result.mapped()).to.eql({});
      });
    });
  });

  it('checks req.' + checkedObject, () => {
    const req = {
      [checkedObject]: { upper: 'ABC', lower: 'DEF' }
    };

    expressValidator()(req, {}, () => {});
    req[methodName]('upper').isUppercase();
    req[methodName]('lower').isLowercase();

    return req.getValidationResult().then(result => {
      expect(result.mapped()).to.not.have.property('upper');
      expect(result.mapped()).to.have.property('lower');
    });
  });
};

exports.sanitizeObjectSpec = sanitizedObject => {
  const reqObjects = ['body', 'cookies', 'query', 'params', 'headers'];
  const methodName = 'sanitize' + sanitizedObject[0].toUpperCase() + sanitizedObject.substr(1);

  reqObjects.filter(obj => obj !== sanitizedObject).forEach(obj => {
    it('does not sanitize req.' + obj, () => {
      const req = {};
      req[obj] = { int: 'asd' };

      expressValidator()(req, {}, () => {});
      req[methodName]('int').toInt();

      expect(req[obj].int).to.equal('asd');
    });
  });

  it(`sanitizes req.${sanitizedObject} in place and returns the sanitized value`, () => {
    const req = {
      [sanitizedObject]: { username: '  my username  ' }
    };

    expressValidator()(req, {}, () => {});
    const value = req[methodName]('username').trim();

    expect(req[sanitizedObject].username).to.equal('my username');
    expect(value).to.equal('my username');
  });
};