import { ValidationError, contextsKey } from './base';
import { ErrorFormatter, validationResult } from './validation-result';
import { ContextBuilder } from './context-builder';

const allErrors: ValidationError[] = [
  { param: 'foo', msg: 'blabla', location: 'body', value: 123 },
  { param: 'foo', msg: 'watwat', location: 'body', value: 123 },
  { param: 'bar', msg: 'yay', location: 'query', value: 'qux' },
];

const makeContextsList = (errors: ValidationError[]) => {
  const context1 = new ContextBuilder().build();
  Object.defineProperty(context1, 'errors', {
    value: errors.slice(0, 1),
  });

  const context2 = new ContextBuilder().build();
  Object.defineProperty(context2, 'errors', {
    value: errors.slice(1),
  });

  return [context1, context2];
};

it('works when there are no errors', () => {
  const result = validationResult({});
  expect(() => result.throw()).not.toThrow();
  expect(result.mapped()).toEqual({});
  expect(result.array()).toEqual([]);
  expect(result.isEmpty()).toBe(true);
});

describe('#isEmpty()', () => {
  it('returns whether there are errors', () => {
    let result = validationResult({ [contextsKey]: makeContextsList([]) });
    expect(result.isEmpty()).toBe(true);

    result = validationResult({ [contextsKey]: makeContextsList(allErrors) });
    expect(result.isEmpty()).toBe(false);
  });
});

describe('#array()', () => {
  it('returns all errors', () => {
    const result = validationResult({ [contextsKey]: makeContextsList(allErrors) });
    expect(result.array()).toEqual(allErrors);
  });

  it('returns only the first error for each field when onlyFirstError = true', () => {
    const result = validationResult({ [contextsKey]: makeContextsList(allErrors) });
    expect(result.array({ onlyFirstError: true })).toEqual([allErrors[0], allErrors[2]]);
  });
});

describe('#mapped()', () => {
  it('returns an object with the first error of each field', () => {
    const result = validationResult({ [contextsKey]: makeContextsList(allErrors) });
    expect(result.mapped()).toEqual({
      foo: allErrors[0],
      bar: allErrors[2],
    });
  });
});

describe('#throw()', () => {
  it('does not throw when there are no errors', () => {
    const result = validationResult({ [contextsKey]: makeContextsList([]) });
    expect(() => result.throw()).not.toThrow();
  });

  it('throws when there are errors', () => {
    const result = validationResult({ [contextsKey]: makeContextsList(allErrors) });
    expect(() => result.throw()).toThrowError();
  });

  it('throws error decorated as Result', done => {
    const result = validationResult({ [contextsKey]: makeContextsList(allErrors) });
    try {
      result.throw();
      done(new Error('no errors thrown'));
    } catch (e) {
      expect(e.mapped()).toEqual({ foo: allErrors[0], bar: allErrors[2] });
      expect(e.array()).toEqual(allErrors);
      done();
    }
  });
});

describe('#formatWith()', () => {
  it('returns a new instance of Result', () => {
    const result = validationResult({ [contextsKey]: makeContextsList([]) });
    expect(result.formatWith(err => err.msg)).not.toBe(result);
  });

  it('sets a new formatter that is used with #array()', () => {
    const formatter: ErrorFormatter = err => err.msg;
    const result = validationResult({ [contextsKey]: makeContextsList(allErrors) }).formatWith(
      formatter,
    );

    expect(result.array()).toEqual(allErrors.map(formatter));
  });

  it('sets a new formatter that is used with #mapped()', () => {
    const formatter: ErrorFormatter = err => err.msg;
    const result = validationResult({ [contextsKey]: makeContextsList(allErrors) }).formatWith(
      formatter,
    );

    expect(result.mapped()).toEqual({
      foo: formatter(allErrors[0]),
      bar: formatter(allErrors[2]),
    });
  });
});

describe('.withDefaults()', () => {
  it('lets specify custom default formatter', () => {
    let formatter: ErrorFormatter = err => `${err.param} is broken, fix it`;
    const customFactory = validationResult.withDefaults({ formatter });

    let result = customFactory({ [contextsKey]: makeContextsList(allErrors) });
    expect(result.array()).toEqual(allErrors.map(formatter));

    formatter = err => err.msg;
    result = result.formatWith(formatter);
    expect(result.array()).toEqual(allErrors.map(formatter));
  });
});
