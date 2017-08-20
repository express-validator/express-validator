const expect = require('chai').expect;
const expressValidator = require('..');

describe('Legacy: req.sanitize()/req.filter()', () => {
  it('has all the aliases', () => {
    const req = {};
    expressValidator()(req, {}, () => {});

    expect(req.sanitize).to.be.a('function');
    expect(req.filter).to.equal(req.sanitize);
  });

  it('returns the sanitized input', () => {
    const req = {
      params: { username: '   my username ' }
    };

    expressValidator()(req, {}, () => {});

    const username = req.sanitize('username').trim();
    expect(username).to.equal('my username');
  });

  it('sanitizes req.body, req.params and req.query in place', () => {
    const req = {
      body: { int: '123' },
      params: { int: '456' },
      query: { int: '789' }
    };

    expressValidator()(req, {}, () => {});
    req.sanitize('int').toInt();

    expect(req.body.int).to.equal(123);
    expect(req.params.int).to.equal(456);
    expect(req.query.int).to.equal(789);
  });
});