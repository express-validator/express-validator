const { expect } = require('chai');
const validator = require('validator');

const sanitize = require('./sanitize');

describe('filter: sanitize', () => {
  it('returns chain with all validator\'s sanitization methods', () => {
    const chain = sanitize();
    Object.keys(validator)
      .filter(methodName => methodName.startsWith('to'))
      .forEach(methodName => {
        expect(chain).to.have.property(methodName);
      });

    expect(chain).to.have.property('blacklist');
    expect(chain).to.have.property('escape');
    expect(chain).to.have.property('unescape');
    expect(chain).to.have.property('normalizeEmail');
    expect(chain).to.have.property('ltrim');
    expect(chain).to.have.property('rtrim');
    expect(chain).to.have.property('trim');
    expect(chain).to.have.property('stripLow');
    expect(chain).to.have.property('whitelist');
  });

  it('modifies each selected field in the request', () => {
    const req = {
      body: { foo: ' bar   ' },
      query: { baz: '   qux' }
    };

    const chain = sanitize(['foo', 'baz'], ['body', 'query'])
      .trim();

    chain(req, {}, () => {});
    expect(req.body.foo).to.equal('bar');
    expect(req.query.baz).to.equal('qux');
  });

  it('calls the next() callback', () => {
    let called = false;
    const next = () => called = true;

    sanitize('foo', ['body'])({}, {}, next);
    expect(called).to.be.true;
  });

  describe('.customSanitizer()', () => {
    it('adds a custom inline sanitizer', () => {
      const req = {
        body: { foo: '42' }
      };

      const chain = sanitize('foo', ['body']).customSanitizer(value => Number(value));
      chain(req, {}, () => {});

      expect(req.body.foo).to.equal(42);
    });

    it('runs a custom inline sanitizer on string types', () => {
      const req = {
        body: { foo: '42' }
      };

      const chain = sanitize('foo', ['body']).customSanitizer(() => true);
      chain(req, {}, () => {});

      expect(req.body.foo).to.equal(true);
    });

    it('runs a custom inline sanitizer on undefined types', () => {
      const req = {
        body: { foo: undefined }
      };

      const chain = sanitize('foo', ['body']).customSanitizer(() => true);
      chain(req, {}, () => {});

      expect(req.body.foo).to.equal(true);
    });

    it('runs a custom inline sanitizer on number types', () => {
      const req = {
        body: { foo: 42 }
      };

      const chain = sanitize('foo', ['body']).customSanitizer(() => true);
      chain(req, {}, () => {});

      expect(req.body.foo).to.equal(true);
    });

    it('runs a custom inline sanitizer on object types', () => {
      const req = {
        body: { foo: {} }
      };

      const chain = sanitize('foo', ['body']).customSanitizer(() => true);
      chain(req, {}, () => {});

      expect(req.body.foo).to.equal(true);
    });

    it('runs a custom inline sanitizer on array types', () => {
      const req = {
        body: { foo: [] }
      };

      const chain = sanitize('foo', ['body']).customSanitizer(() => true);
      chain(req, {}, () => {});

      expect(req.body.foo).to.equal(true);
    });

    it('runs a custom inline sanitizer on boolean types', () => {
      const req = {
        body: { foo: false }
      };

      const chain = sanitize('foo', ['body']).customSanitizer(() => true);
      chain(req, {}, () => {});

      expect(req.body.foo).to.equal(true);
    });
  });
});