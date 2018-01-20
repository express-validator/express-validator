import * as express from 'express';
import { check } from './validation-chain-builders';
import { oneOf } from './one-of';

// array of chains, no message
let middleware: express.RequestHandler = oneOf([check('foo')]);

// array of chains, with message
middleware = oneOf([check('foo')], 'message');

// array of arrays of chains, no message
middleware = oneOf([[check('foo')], [check('bar')]]);

// array of arrays of chains, with message
middleware = oneOf([[check('foo')], [check('bar')]], 'message');

// mixed array of chains/arrays of chains, no message
middleware = oneOf([[check('foo')], [check('bar')], check('baz')]);

// mixed array of chains/arrays of chains, with message
middleware = oneOf([[check('foo')], [check('bar')], check('baz')], 'message');

// whatever, with dynamic message
middleware = oneOf([check('foo')], ({ req }: { req: express.Request }) => {
  return req.baseUrl;
});