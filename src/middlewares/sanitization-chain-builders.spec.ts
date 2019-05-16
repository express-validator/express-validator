import { Request } from '../base';
import {
  buildSanitizeFunction,
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery,
} from './sanitization-chain-builders';

let req: Request;
beforeEach(() => {
  req = {
    body: { foo: '123' },
    cookies: { foo: '123' },
    headers: { foo: '123' },
    params: { foo: '123' },
    query: { foo: '123' },
  };
});

describe('buildSanitizeFunction()', () => {
  it('creates a validation chain builder that checks custom locations', done => {
    const custom = buildSanitizeFunction(['cookies', 'headers']);
    custom('foo').toInt()(req, {}, () => {
      expect(req.body.foo).toBe('123');
      expect(req.cookies!.foo).toBe(123);
      expect(req.headers!.foo).toBe(123);
      expect(req.params!.foo).toBe('123');
      expect(req.query!.foo).toBe('123');

      done();
    });
  });
});

describe('sanitize()', () => {
  // TODO: Can't use it.each because it doesn't support done() in TypeScript
  ['body', 'cookies', 'params', 'query'].forEach(location => {
    it(`sanitizes ${location}`, done => {
      const req2 = { [location]: { foo: '123' } };
      sanitize('foo').toInt()(req2, {}, () => {
        expect(req2[location].foo).toBe(123);
        done();
      });
    });
  });

  // TODO: Look into why headers were not sanitized back in v3
  it('sanitizes all locations but headers at the same time', done => {
    sanitize('foo').toInt()(req, {}, () => {
      expect(req.body.foo).toBe(123);
      expect(req.cookies!.foo).toBe(123);
      expect(req.headers!.foo).toBe('123');
      expect(req.params!.foo).toBe(123);
      expect(req.query!.foo).toBe(123);
      done();
    });
  });
});

describe('sanitizeBody()', () => {
  it('sanitizes only the body location', done => {
    sanitizeBody('foo').toInt()(req, {}, () => {
      expect(req.body.foo).toBe(123);
      expect(req.cookies!.foo).toBe('123');
      expect(req.headers!.foo).toBe('123');
      expect(req.params!.foo).toBe('123');
      expect(req.query!.foo).toBe('123');
      done();
    });
  });
});

describe('sanitizeCookie()', () => {
  it('sanitizes only the cookies location', done => {
    sanitizeCookie('foo').toInt()(req, {}, () => {
      expect(req.body.foo).toBe('123');
      expect(req.cookies!.foo).toBe(123);
      expect(req.headers!.foo).toBe('123');
      expect(req.params!.foo).toBe('123');
      expect(req.query!.foo).toBe('123');
      done();
    });
  });
});

describe('sanitizeParam()', () => {
  it('sanitizes only the params location', done => {
    sanitizeParam('foo').toInt()(req, {}, () => {
      expect(req.body.foo).toBe('123');
      expect(req.cookies!.foo).toBe('123');
      expect(req.headers!.foo).toBe('123');
      expect(req.params!.foo).toBe(123);
      expect(req.query!.foo).toBe('123');
      done();
    });
  });
});

describe('sanitizeQuery()', () => {
  it('sanitizes only the query location', done => {
    sanitizeQuery('foo').toInt()(req, {}, () => {
      expect(req.body.foo).toBe('123');
      expect(req.cookies!.foo).toBe('123');
      expect(req.headers!.foo).toBe('123');
      expect(req.params!.foo).toBe('123');
      expect(req.query!.foo).toBe(123);
      done();
    });
  });
});
