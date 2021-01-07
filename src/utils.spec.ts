import { toString } from './utils';

describe('#toString', () => {
  it('calls custom toString function', () => {
    const value = {
      toString() {
        return 'foo';
      },
    };
    expect(toString(value)).toEqual('foo');
  });

  it('test custom object toString not "function"', () => {
    const value = {
      toString: 'something',
    };

    expect(toString(value)).toEqual('[object Object]');
  });

  it('test missing object toString', () => {
    const value = {
      foo: 'foo',
    };

    expect(toString(value)).toEqual('[object Object]');
  });
});
