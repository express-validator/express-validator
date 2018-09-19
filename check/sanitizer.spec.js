const { expect } = require('chai');
const { check } = require('./validation-chain-builders');

describe('.toInt()', () => {
  it('A whole number as a string, becomes a number', () => {
    const req = {
      body: { foo: '88' }
    };

    check('foo').toInt()(req, {}, () => { });
    expect(req.body.foo).to.equal(88);
  });

  it('A whole number as a number is still a number', () => {
    const req = {
      body: { foo: 15 }
    };

    check('foo').toInt()(req, {}, () => { });
    expect(req.body.foo).to.equal(15);
  });

  it('A floating point number as a string, becomes a number', () => {
    const req = {
      body: { foo: '145.372' }
    };

    check('foo').toInt()(req, {}, () => { });
    expect(req.body.foo).to.equal(145);
  });

  it('A whole number as a number is still a number', () => {
    const req = {
      body: { foo: 77.87 }
    };

    check('foo').toInt()(req, {}, () => { });
    expect(req.body.foo).to.equal(77);
  });
});

describe('.toBoolean()', () => {
  it('A string of "true", should be a boolean true', () => {
    const req = {
      body: { foo: 'true' }
    };

    check('foo').toBoolean(true)(req, {}, () => { });
    expect(req.body.foo).to.equal(true);
  });

  it('A boolean of true, should be a boolean true', () => {
    const req = {
      body: { foo: true }
    };

    check('foo').toBoolean(true)(req, {}, () => { });
    expect(req.body.foo).to.equal(true);
  });

  it('A string of "false", should be a boolean false', () => {
    const req = {
      body: { foo: 'false' }
    };

    check('foo').toBoolean(true)(req, {}, () => { });
    expect(req.body.foo).to.equal(false);
  });

  it('A boolean of false, should be a boolean false', () => {
    const req = {
      body: { foo: false }
    };

    check('foo').toBoolean(true)(req, {}, () => { });
    expect(req.body.foo).to.equal(false);
  });

  it('A number of 1234, should be a boolean of false', () => {
    const req = {
      body: { foo: 1234 }
    };

    check('foo').toBoolean(true)(req, {}, () => { });
    expect(req.body.foo).to.equal(false);
  });
});