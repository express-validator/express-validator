const { expect } = require('chai');
const persistValues = require('./persist-values');

describe('utils: persistValues', () => {
  it('persists selected fields back into req', () => {
    const req = {
      query: { foo: ' bar ' },
      body: { bar: { baz: ' qux ' } }
    };

    persistValues(req, {
      fields: ['foo', 'bar.baz'],
      locations: ['query', 'body'],
      sanitizers: [{
        options: [],
        sanitizer: value => value.trim()
      }]
    });

    expect(req.query.foo).to.equal('bar');
    expect(req.body.bar.baz).to.equal('qux');
  });

  it('does not persist undefined values into req when the key does not exist', () => {
    const req = {
      query: {}
    };

    persistValues(req, {
      fields: ['foo'],
      locations: ['query']
    });

    expect(req.query).not.to.have.key('foo');
  });
});