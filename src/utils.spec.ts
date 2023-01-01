import { toString } from './utils';

describe('#toString', () => {
  it('arrays should be converted to a single string', () => {
    const value = ['foo', 1, false];
    expect(toString(value)).toEqual('foo,1,false');
  });

  it('calls custom toString function', () => {
    const value = {
      toString() {
        return 'foo';
      },
    };
    expect(toString(value)).toEqual('foo');
  });

  it('calls Object.prototype.toString() when custom one is not function', () => {
    const value = {
      toString: 'something',
    };

    expect(toString(value)).toEqual('[object Object]');
  });

  it('calls Object.prototype.toString() when passed object does not have a toString function', () => {
    const value = {
      foo: 'foo',
    };

    expect(toString(value)).toEqual('[object Object]');
  });
});
