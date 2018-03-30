const { expect } = require('chai');
const selectFields = require('./select-fields');

describe('utils: selectFields', () => {
  it('is done in all given request locations', () => {
    const req = {
      body: { foo: 'a' },
      params: { foo: 'b' },
      query: { foo: 'c' }
    };

    const instances = selectFields(req, {
      locations: ['body', 'query'],
      fields: ['foo']
    });

    expect(instances).to.have.length(2);
    expect(instances).to.deep.include({
      location: 'body',
      path: 'foo',
      originalValue: 'a',
      value: 'a'
    });
    expect(instances).to.deep.include({
      location: 'query',
      path: 'foo',
      originalValue: 'c',
      value: 'c'
    });
  });

  it('accepts multiple fields using array', () => {
    const req = {
      query: { a: 'ASD', b: 'BCA' }
    };

    const instances = selectFields(req, {
      fields: ['a', 'b'],
      locations: ['query']
    });

    expect(instances).to.have.length(2);
    expect(instances).to.deep.include({
      location: 'query',
      path: 'a',
      originalValue: 'ASD',
      value: 'ASD'
    });
    expect(instances).to.deep.include({
      location: 'query',
      path: 'b',
      originalValue: 'BCA',
      value: 'BCA'
    });
  });

  it('is done in nested locations using dot-notation and square brackets', () => {
    const req = {
      body: { foo: [{ bar: 'a' }] }
    };

    const instances = selectFields(req, {
      fields: ['foo[0].bar'],
      locations: ['body']
    });

    expect(instances).to.have.length(1);
    expect(instances).to.deep.include({
      path: 'foo[0].bar',
      location: 'body',
      originalValue: 'a',
      value: 'a'
    });
  });

  it('is done in nested wildcard locations with `undefined` values for validation', () => {
    const req = {
      body: { foo: [{}, { bar: 'a'}] }
    };

    const instances = selectFields(req, {
      fields: ['foo.*.bar'],
      locations: ['body']
    });

    expect(instances).to.have.length(2);
    expect(instances).to.deep.include({
      path: 'foo[0].bar',
      location: 'body',
      originalValue: undefined,
      value: undefined
    });
    expect(instances).to.deep.include({
      path: 'foo[1].bar',
      location: 'body',
      originalValue: 'a',
      value: 'a'
    });
  });

  it('expands "*" wildcards shallowly', () => {
    const req = {
      body: {
        foo: [{ a: 123, b: 456 }]
      }
    };

    const instances = selectFields(req, {
      // Note that the first expression matches both "a" and "b",
      // so there's some deduplication expected
      fields: ['*[0].*', 'foo.*.b'],
      locations: ['body']
    });

    expect(instances).to.have.length(2);
    expect(instances).to.deep.include({
      path: 'foo[0].a',
      location: 'body',
      originalValue: 123,
      value: 123
    });
    expect(instances).to.deep.include({
      path: 'foo[0].b',
      location: 'body',
      originalValue: 456,
      value: 456
    });
  });

  it('returns all root fields if selected field is "*"', () => {
    const req = {
      body: ['foo', 'bar']
    };

    const instances = selectFields(req, {
      fields: ['*'],
      locations: ['body']
    });

    expect(instances).to.have.lengthOf(2);
    expect(instances).to.deep.include({
      path: '[0]',
      location: 'body',
      originalValue: 'foo',
      value: 'foo'
    });
    expect(instances).to.deep.include({
      path: '[1]',
      location: 'body',
      originalValue: 'bar',
      value: 'bar'
    });
  });

  it('selects whole request location if no path is given', () => {
    const req = {
      body: ['foo', 'bar']
    };

    const instances = selectFields(req, {
      fields: [undefined],
      locations: ['body']
    });

    expect(instances).to.have.lengthOf(1);
    expect(instances).to.deep.include({
      path: '',
      location: 'body',
      originalValue: ['foo', 'bar'],
      value: ['foo', 'bar']
    });
  })

  describe('sanitization', () => {
    it('runs on the selected values', () => {
      const req = {
        query: { email: ' FOO@BAR.COM ' }
      };

      const instances = selectFields(req, {
        locations: ['query'],
        fields: ['email'],
        sanitizers: [{
          sanitizer: (value, side) => {
            return side === 'left' ? value.replace(/^\s+/, '') : value.replace(/\s+$/, '');
          },
          options: ['left']
        }, {
          sanitizer: value => value.toLowerCase(),
          options: []
        }]
      });

      expect(instances[0]).to.eql({
        location: 'query',
        path: 'email',
        originalValue: ' FOO@BAR.COM ',
        value: 'foo@bar.com '
      });
    });

    it('does not run on non-string fields', () => {
      const req = {
        body: { answer: 42 }
      };

      const instances = selectFields(req, {
        locations: ['body'],
        fields: ['answer'],
        sanitizers: [{
          options: [],
          sanitizer: value => 'best number is ' +  value
        }]
      });

      expect(instances[0]).to.eql({
        location: 'body',
        path: 'answer',
        originalValue: 42,
        value: 42
      });
    });

    it('runs custom sanitizers', () => {
      const req = {
        params: { id: '10' }
      };

      const instances = selectFields(req, {
        locations: ['params'],
        fields: ['id'],
        sanitizers: [{
          custom: true,
          options: [],
          sanitizer: (value, { req, location, path }) => ({
            value,
            req,
            location,
            path
          })
        }]
      });

      expect(instances[0].value).to.eql({
        req,
        value: '10',
        location: 'params',
        path: 'id'
      });
    });
  });

  describe('optional context', () => {
    it('ignores fields which are not present in case of checkFalsy = false', () => {
      const instances = selectFields({
        params: { bar: 0 }
      }, {
        optional: { checkFalsy: false },
        locations: ['params'],
        fields: ['foo', 'bar']
      });

      expect(instances).to.have.length(1);
      expect(instances).to.deep.include({
        location: 'params',
        path: 'bar',
        originalValue: 0,
        value: 0
      });
    });

    it('ignores fields which are falsy in case of checkFalsy = true', () => {
      const instances = selectFields({
        params: { bar: 0 }
      }, {
        optional: { checkFalsy: true },
        locations: ['params'],
        fields: ['foo', 'bar']
      });

      expect(instances).to.have.length(0);
    });

    it('ignores fields which are undefined or null in case of nullable = true', () => {
      const instances = selectFields({
        params: { bar: null }
      }, {
        optional: { nullable: true },
        locations: ['params'],
        fields: ['foo', 'bar']
      });

      expect(instances).to.have.length(0);
    });

    it('runs with the result of the sanitization when checkFalsy = true', () => {
      const instances = selectFields({
        params: { trimmed: '   ' }
      }, {
        optional: { checkFalsy: true },
        locations: ['params'],
        fields: ['trimmed'],
        sanitizers: [{ sanitizer: value => value.trim(), options: []}]
      });

      expect(instances).to.have.length(0);
    });
  });

  describe('when there are multiple locations', () => {
    it('ignores those which do not have value in case others do', () => {
      const req = {
        body: { foo: 'a' },
        query: {}
      };

      const instances = selectFields(req, {
        fields: ['foo'],
        locations: ['body', 'query']
      });

      expect(instances).to.have.length(1);
      expect(instances).to.deep.include({
        location: 'body',
        path: 'foo',
        originalValue: 'a',
        value: 'a'
      });
    });

    it('includes at least one in case none have value', () => {
      const req = {
        body: {},
        query: {}
      };

      const instances = selectFields(req, {
        fields: ['foo'],
        locations: ['body', 'query']
      });

      expect(instances).to.have.length(1);
      expect(instances).to.deep.include({
        location: 'body',
        path: 'foo',
        originalValue: undefined,
        value: undefined
      });
    });
  });
});
