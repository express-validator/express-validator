const expect = require('chai').expect;
const expressValidator = require('..');

describe('Custom sanitizers', () => {
  it('exist in the sanitizer chain', () => {
    const req = {};
    expressValidator({
      customSanitizers: {
        toFoo: () => 'foo'
      }
    })(req, {}, () => {});

    expect(req.sanitize('foo').toFoo).to.be.a('function');
  });

  it('receive the value and additional args', () => {
    const req = {
      body: { foobar: 'foobarbazqux' }
    };

    expressValidator({
      customSanitizers: {
        firstChars: (value, len) => value.substr(0, len)
      }
    })(req, {}, () => {});

    const value = req.sanitize('foobar').firstChars(3);
    expect(value).to.equal('foo');
    expect(req.body.foobar).to.equal('foo');
  });

  it('are not shared across apps', () => {
    const req1 = {};
    expressValidator({
      customSanitizers: {
        toFoo: () => 'foo'
      }
    })(req1, {}, () => {});

    const req2 = {};
    expressValidator({
      customSanitizers: {
        toBar: () => 'bar'
      }
    })(req2, {}, () => {});

    expect(req2.sanitize('foo').toFoo).to.not.exist;
    expect(req1.sanitize('bar').toBar).to.not.exist;
  });
});