import { InternalRequest, errorsSymbol } from '../base';
import {
  body,
  buildCheckFunction,
  check,
  cookie,
  header,
  param,
  query,
} from './validation-chain-builders';

let req: InternalRequest;
beforeEach(() => {
  req = {
    body: { foo: 'asd' },
    cookies: { foo: 'asd' },
    headers: { foo: 'asd' },
    params: { foo: 'asd' },
    query: { foo: 'asd' },
  };
});

describe('buildCheckFunction()', () => {
  it('creates a validation chain builder that checks custom locations', done => {
    const custom = buildCheckFunction(['cookies', 'headers']);
    custom('foo').isInt()(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(2);
      expect(req[errorsSymbol]![0]).toEqual({
        location: 'cookies',
        msg: 'Invalid value',
        param: 'foo',
        value: 'asd',
      });
      expect(req[errorsSymbol]![1]).toEqual({
        location: 'headers',
        msg: 'Invalid value',
        param: 'foo',
        value: 'asd',
      });

      done();
    });
  });
});

describe('check()', () => {
  // TODO: Can't use it.each because it doesn't support done() in TypeScript
  ['body', 'cookies', 'headers', 'params', 'query'].forEach(location => {
    it(`checks ${location}`, done => {
      const req: InternalRequest = { [location]: { foo: 'asd' } };
      check('foo').isInt()(req, {}, () => {
        expect(req[errorsSymbol]).toHaveLength(1);
        expect(req[errorsSymbol]![0].location).toBe(location);
        done();
      });
    });
  });

  it('checks all locations at the same time', done => {
    check('foo').isInt()(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(5);
      done();
    });
  });
});

describe('body()', () => {
  it('checks only the body location', done => {
    body('foo').isInt()(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(1);
      expect(req[errorsSymbol]![0].location).toBe('body');
      done();
    });
  });
});

describe('cookie()', () => {
  it('checks only the body location', done => {
    cookie('foo').isInt()(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(1);
      expect(req[errorsSymbol]![0].location).toBe('cookies');
      done();
    });
  });
});

describe('header()', () => {
  it('checks only the body location', done => {
    header('foo').isInt()(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(1);
      expect(req[errorsSymbol]![0].location).toBe('headers');
      done();
    });
  });
});

describe('param()', () => {
  it('checks only the body location', done => {
    param('foo').isInt()(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(1);
      expect(req[errorsSymbol]![0].location).toBe('params');
      done();
    });
  });
});

describe('query()', () => {
  it('checks only the body location', done => {
    query('foo').isInt()(req, {}, () => {
      expect(req[errorsSymbol]).toHaveLength(1);
      expect(req[errorsSymbol]![0].location).toBe('query');
      done();
    });
  });
});
