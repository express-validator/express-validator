import { check, body, cookie, header, param, query } from './validation-chain-builders';
import { ValidationChain } from './check';

let chain: ValidationChain = check('foo');
chain = body('foo');
chain = cookie('foo');
chain = header('foo');
chain = param('foo');
chain = query('foo');