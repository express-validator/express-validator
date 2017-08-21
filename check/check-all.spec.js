const expect = require('chai').expect;
const checkAll = require('./check-all');

describe('check: checkAll middleware', () => {
  it('checks body', () => {
    const req = {
      body: { foo: 'asd' }
    };

    return checkAll('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks query', () => {
    const req = {
      query: { foo: 'asd' }
    };

    return checkAll('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks params', () => {
    const req = {
      params: { foo: 'asd' }
    };

    return checkAll('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks cookies', () => {
    const req = {
      cookies: { foo: 'asd' }
    };

    return checkAll('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks headers', () => {
    const req = {
      headers: { Foo: 'asd' }
    };

    return checkAll('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(1);
    });
  });

  it('checks all locations at the same time', () => {
    const req = {
      body: { foo: 'asd' },
      cookies: { foo: 'asd' },
      params: { foo: 'asd' },
      query: { foo: 'asd' },
      headers: { foo: 'asd' }
    };

    return checkAll('foo').isInt()(req, {}, () => {}).then(() => {
      expect(req._validationErrors).to.have.length(5);
    });
  });
});