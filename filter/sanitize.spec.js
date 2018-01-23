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

  it('modifies by custom sanitizer', () => {
    const req = {
      body: { foo: 1},
      query: {baz: 2}
    };

    const chain = sanitize(['foo', 'baz'], ['body', 'query'])
      .customSanitizer((val, mul, add) => val * mul + add, 10, 5)

    chain(req, {}, () => {});
    expect(req.body.foo).to.equal(15)
    expect(req.query.baz).to.equal(25)
  });
});
