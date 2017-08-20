const expect = require('chai').expect;
const expressValidator = require('..');

describe('Legacy: Nested paths', () => {
  const checkDotNotation = checkedObject => {
    const methodName = 'check' + checkedObject[0].toUpperCase() + checkedObject.substr(1);

    it(`works with req.${methodName}() using dot-notation`, () => {
      const req = {
        [checkedObject]: {
          nested: { path: [ 'is@email.com', 'notemail.com' ] }
        }
      };

      expressValidator()(req, {}, () => {});
      req[methodName]('nested.path[0]').isEmail();
      req[methodName]('nested.path[1]').isEmail();

      return req.getValidationResult().then(result => {
        expect(result.mapped()).to.not.have.property('nested.path[0]');
        expect(result.mapped()).to.have.property('nested.path[1]');
      });
    });
  };

  const checkArray = checkedObject => {
    const methodName = 'check' + checkedObject[0].toUpperCase() + checkedObject.substr(1);

    it(`works with req.${methodName}() using array`, () => {
      const req = {
        [checkedObject]: {
          nested: { path: [ 'is@email.com', 'notemail.com' ] }
        }
      };

      expressValidator()(req, {}, () => {});
      req[methodName](['nested', 'path', 0]).isEmail();
      req[methodName](['nested', 'path', 1]).isEmail();

      return req.getValidationResult().then(result => {
        expect(result.mapped()).to.not.have.property('nested.path[0]');
        expect(result.mapped()).to.have.property('nested.path[1]');
      });
    });
  };

  const sanitizeDotNotation = sanitizedObject => {
    const methodName = 'sanitize' + sanitizedObject[0].toUpperCase() + sanitizedObject.substr(1);

    it(`works with req.${methodName}() using dot-notation`, () => {
      const req = {
        [sanitizedObject]: {
          nested: { path: [ '  my username  ' ] }
        }
      };

      expressValidator()(req, {}, () => {});

      const value = req[methodName]('nested.path[0]').trim();
      expect(value).to.equal('my username');
      expect(req[sanitizedObject].nested.path[0]).to.equal('my username');
    });
  };

  const sanitizeArray = sanitizedObject => {
    const methodName = 'sanitize' + sanitizedObject[0].toUpperCase() + sanitizedObject.substr(1);

    it(`works with req.${methodName}() using array`, () => {
      const req = {
        [sanitizedObject]: {
          nested: { path: [ '  my username  ' ] }
        }
      };

      expressValidator()(req, {}, () => {});

      const value = req[methodName]('nested.path[0]').trim();
      expect(value).to.equal('my username');
      expect(req[sanitizedObject].nested.path[0]).to.equal('my username');
    });
  };

  checkDotNotation('body');
  checkDotNotation('cookies');
  checkDotNotation('headers');
  checkDotNotation('params');
  checkDotNotation('query');

  checkArray('body');
  checkArray('cookies');
  // checkArray('headers'); // outstanding bug
  checkArray('params');
  checkArray('query');

  sanitizeDotNotation('body');
  sanitizeDotNotation('cookies');
  sanitizeDotNotation('headers');
  sanitizeDotNotation('params');
  sanitizeDotNotation('query');

  sanitizeArray('body');
  sanitizeArray('cookies');
  // sanitizeArray('headers'); // outstanding bug
  sanitizeArray('params');
  sanitizeArray('query');
});