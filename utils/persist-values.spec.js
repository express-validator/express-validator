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
});