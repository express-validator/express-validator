const { expect } = require('chai');
const {
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery
} = require('./sanitization-chain-builders');

describe('filter: sanitizeAll middleware', () => {
  it('sanitizes body', () => {
    const req = {
      body: { foo: '123' }
    };

    sanitize('foo').toInt()(req, {}, () => {});
    expect(req.body.foo).to.equal(123);
  });

  it('sanitizes query', () => {
    const req = {
      query: { foo: '123' }
    };

    sanitize('foo').toInt()(req, {}, () => {});
    expect(req.query.foo).to.equal(123);
  });

  it('sanitizes params', () => {
    const req = {
      params: { foo: '123' }
    };

    sanitize('foo').toInt()(req, {}, () => {});
    expect(req.params.foo).to.equal(123);
  });

  it('sanitizes cookies', () => {
    const req = {
      cookies: { foo: '123' }
    };

    sanitize('foo').toInt()(req, {}, () => {});
    expect(req.cookies.foo).to.equal(123);
  });

  it('sanitizes all locations at the same time', () => {
    const req = {
      body: { foo: '123' },
      cookies: { foo: '123' },
      params: { foo: '123' },
      query: { foo: '123' }
    };

    sanitize('foo').toInt()(req, {}, () => {});
    expect(req.body.foo).to.equal(123);
    expect(req.cookies.foo).to.equal(123);
    expect(req.query.foo).to.equal(123);
    expect(req.params.foo).to.equal(123);
  });
});

describe('filter: sanitizeBody middleware', () => {
  it('sanitizes body', () => {
    const req = {
      body: { foo: '123' }
    };

    sanitizeBody('foo').toInt()(req, {}, () => {});
    expect(req.body.foo).to.equal(123);
  });
});

describe('filter: sanitizeCookies middleware', () => {
  it('sanitizes cookies', () => {
    const req = {
      cookies: { foo: '123' }
    };

    sanitizeCookie('foo').toInt()(req, {}, () => {});
    expect(req.cookies.foo).to.equal(123);
  });
});

describe('filter: sanitizeParams middleware', () => {
  it('sanitizes params', () => {
    const req = {
      params: { foo: '123' }
    };

    sanitizeParam('foo').toInt()(req, {}, () => {});
    expect(req.params.foo).to.equal(123);
  });
});

describe('filter: sanitizeQuery middleware', () => {
  it('sanitizes query', () => {
    const req = {
      query: { foo: '123' }
    };

    sanitizeQuery('foo').toInt()(req, {}, () => {});
    expect(req.query.foo).to.equal(123);
  });
});