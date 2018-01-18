import { buildCheckFunction, check, body, cookie, header, param, query } from './validation-chain-builders';
import { ValidationChain } from './check';

let chain: ValidationChain = check('foo');
chain = check('foo', 'message');
chain = check(['foo', 'bar']);
chain = check(['foo', 'bar'], 'message');

chain = body('foo');
chain = body('foo', 'message');
chain = body(['foo', 'bar']);
chain = body(['foo', 'bar'], 'message');

chain = cookie('foo');
chain = cookie('foo', 'message');
chain = cookie(['foo', 'bar']);
chain = cookie(['foo', 'bar'], 'message');

chain = header('foo');
chain = header('foo', 'message');
chain = header(['foo', 'bar']);
chain = header(['foo', 'bar'], 'message');

chain = param('foo');
chain = param('foo', 'message');
chain = param(['foo', 'bar']);
chain = param(['foo', 'bar'], 'message');

chain = query('foo');
chain = query('foo', 'message');
chain = query(['foo', 'bar']);
chain = query(['foo', 'bar'], 'message');

const customCheck = buildCheckFunction(['headers', 'query']);
chain = customCheck('foo');
chain = customCheck('foo', 'message');
chain = customCheck(['foo', 'bar']);
chain = customCheck(['foo', 'bar'], 'message');