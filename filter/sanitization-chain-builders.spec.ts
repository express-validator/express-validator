import {
  sanitize,
  sanitizeBody,
  sanitizeCookie,
  sanitizeParam,
  sanitizeQuery
} from './sanitization-chain-builders';
import { SanitizationChain } from './sanitize';

let chain: SanitizationChain = sanitize('foo');
chain = sanitizeCookie(['foo', 'bar']);

chain = sanitizeBody('foo');
chain = sanitizeBody(['foo', 'bar']);

chain = sanitizeCookie('foo');
chain = sanitizeCookie(['foo', 'bar']);

chain = sanitizeParam('foo');
chain = sanitizeParam(['foo', 'bar']);

chain = sanitizeQuery('foo');
chain = sanitizeQuery(['foo', 'bar']);