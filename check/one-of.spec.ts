import * as express from 'express';
import { check } from './validation-chain-builders';
import { oneOf } from './one-of';

let middleware: express.RequestHandler = oneOf([check('foo')]);
middleware = oneOf([check('foo')], 'message');
middleware = oneOf([[check('foo')], [check('bar')]]);
middleware = oneOf([[check('foo')], [check('bar')]], 'message');