const { expect } = require('chai');
const persistValues = require('./persist-values');

describe('utils: persistValues', () => {
  it('persists a list of fields back into req', () => {
    const req = {
      query: { foo: ' bar ' },
      body: { bar: { baz: ' qux ' } }
    };

    persistValues(req, [
      { location: 'query', path: 'foo', value: 'bar' },
      { location: 'body', path: 'bar.baz', value: 'qux' },
    ]);

    expect(req.query.foo).to.equal('bar');
    expect(req.body.bar.baz).to.equal('qux');
  });

  it('does not persist undefined values into req when the key does not exist', () => {
    const req = {
      query: {}
    };

    persistValues(req, [
      { location: 'query', path: 'foo', value: undefined },
    ]);

    expect(req.query).not.to.have.key('foo');
  });
});