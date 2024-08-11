import { Request, ValidationError } from '../base';
import { validationResult } from '../validation-result';
import { ValidationChain } from '../chain';
import {
  body,
  buildCheckFunction,
  check,
  cookie,
  header,
  param,
  query,
} from './validation-chain-builders';

let req: Request;
const runAndGetErrors = (chain: ValidationChain, req: Request) =>
  new Promise<ValidationError[]>(resolve => {
    chain(req, {}, () => {
      resolve(validationResult(req).array());
    });
  });

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
  it('creates a validation chain builder that checks custom locations', async () => {
    const custom = buildCheckFunction(['cookies', 'headers']);
    const chain = custom('foo').isInt();
    const errors = await runAndGetErrors(chain, req);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toEqual({
      type: 'field',
      location: 'cookies',
      msg: 'Invalid value',
      path: 'foo',
      value: 'asd',
    });
    expect(errors![1]).toEqual({
      type: 'field',
      location: 'headers',
      msg: 'Invalid value',
      path: 'foo',
      value: 'asd',
    });
  });
});

describe('check()', () => {
  // TODO: Can't use it.each because it doesn't support done() in TypeScript
  ['body', 'cookies', 'headers', 'params', 'query'].forEach(location => {
    it(`checks ${location}`, async () => {
      const req: Request = { [location]: { foo: 'asd' } };
      const chain = check('foo').isInt();
      const errors = await runAndGetErrors(chain, req);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual(expect.objectContaining({ type: 'field', location }));
    });
  });

  it('checks all locations at the same time', async () => {
    const chain = check('foo').isInt();
    const errors = await runAndGetErrors(chain, req);
    expect(errors).toHaveLength(5);
  });
});

describe('body()', () => {
  it('checks only the body location', async () => {
    const chain = body('foo').isInt();
    const errors = await runAndGetErrors(chain, req);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type: 'field', location: 'body' }));
  });
});

describe('cookie()', () => {
  it('checks only the cookie location', async () => {
    const chain = cookie('foo').isInt();
    const errors = await runAndGetErrors(chain, req);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type: 'field', location: 'cookies' }));
  });
});

describe('header()', () => {
  it('checks only the header location', async () => {
    const chain = header('foo').isInt();
    const errors = await runAndGetErrors(chain, req);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type: 'field', location: 'headers' }));
  });
});

describe('param()', () => {
  it('checks only the param location', async () => {
    const chain = param('foo').isInt();
    const errors = await runAndGetErrors(chain, req);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type: 'field', location: 'params' }));
  });
});

describe('query()', () => {
  it('checks only the query location', async () => {
    const chain = query('foo').isInt();
    const errors = await runAndGetErrors(chain, req);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type: 'field', location: 'query' }));
  });
});
