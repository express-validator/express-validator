import { toString } from './utils';

describe('#toString', () => {
  it.each([
    ['boolean', false, 'false'],
    ['null', null, ''],
    ['undefined', undefined, ''],
    ['NaN', NaN, ''],
    // new Date(Date.UTC()) makes sure we'll not have to deal with timezones
    ['Date object', new Date(Date.UTC(2019, 4, 1, 10, 30, 50, 0)), '2019-05-01T10:30:50.000Z'],
    ['object with custom toString function', { toString: () => 'foo' }, 'foo'],
    ["object with toString that's not a function", { toString: 'something' }, '[object Object]'],
    ['object without custom toString', {}, '[object Object]'],
    ['array', [1, 2, 3], '1,2,3'],
  ])('on %s', (_description, input, expected) => {
    expect(toString(input)).toBe(expected);
  });
});
