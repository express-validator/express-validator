const expect = require('chai').expect;
const sanitizeAll = require('./sanitize-all');

describe('filter: sanitizeAll middleware', () => {
  it('sanitizes body', () => {
    const req = {
      body: { foo: '123' }
    };

    sanitizeAll('foo').toInt()(req, {}, () => {});
    expect(req.body.foo).to.equal(123);
  });

  it('sanitizes query', () => {
    const req = {
      query: { foo: '123' }
    };

    sanitizeAll('foo').toInt()(req, {}, () => {});
    expect(req.query.foo).to.equal(123);
  });

  it('sanitizes params', () => {
    const req = {
      params: { foo: '123' }
    };

    sanitizeAll('foo').toInt()(req, {}, () => {});
    expect(req.params.foo).to.equal(123);
  });

  it('sanitizes cookies', () => {
    const req = {
      cookies: { foo: '123' }
    };

    sanitizeAll('foo').toInt()(req, {}, () => {});
    expect(req.cookies.foo).to.equal(123);
  });

  it('sanitizes all locations at the same time', () => {
    const req = {
      body: { foo: '123' },
      cookies: { foo: '123' },
      params: { foo: '123' },
      query: { foo: '123' }
    };

    sanitizeAll('foo').toInt()(req, {}, () => {});
    expect(req.body.foo).to.equal(123);
    expect(req.cookies.foo).to.equal(123);
    expect(req.query.foo).to.equal(123);
    expect(req.params.foo).to.equal(123);
  });
});