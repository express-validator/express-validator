import { buildCheckFunction, check, body, cookie, header, param, query } from './validation-chain-builders';
import { ValidationChain } from './check';

let chain: ValidationChain = check('foo');
chain = check();
chain = check('foo', 'message');
chain = check(['foo', 'bar']);
chain = check(['foo', 'bar'], 'message');
chain = check('foo', (value, { req, location, path }) => {
  return location + path + value + req.baseUrl;
});

chain = body();
chain = body('foo');
chain = body('foo', 'message');
chain = body(['foo', 'bar']);
chain = body(['foo', 'bar'], 'message');
chain = body('foo', (value, { req, location, path }) => {
  return location + path + value + req.baseUrl;
});

chain = cookie();
chain = cookie('foo');
chain = cookie('foo', 'message');
chain = cookie(['foo', 'bar']);
chain = cookie(['foo', 'bar'], 'message');
chain = cookie('foo', (value, { req, location, path }) => {
  return location + path + value + req.baseUrl;
});

chain = header();
chain = header('foo');
chain = header('foo', 'message');
chain = header(['foo', 'bar']);
chain = header(['foo', 'bar'], 'message');
chain = header('foo', (value, { req, location, path }) => {
  return location + path + value + req.baseUrl;
});

chain = param();
chain = param('foo');
chain = param('foo', 'message');
chain = param(['foo', 'bar']);
chain = param(['foo', 'bar'], 'message');
chain = param('foo', (value, { req, location, path }) => {
  return location + path + value + req.baseUrl;
});

chain = query();
chain = query('foo');
chain = query('foo', 'message');
chain = query(['foo', 'bar']);
chain = query(['foo', 'bar'], 'message');
chain = query('foo', (value, { req, location, path }) => {
  return location + path + value + req.baseUrl;
});

const customCheck = buildCheckFunction(['headers', 'query']);
chain = customCheck();
chain = customCheck('foo');
chain = customCheck('foo', 'message');
chain = customCheck(['foo', 'bar']);
chain = customCheck(['foo', 'bar'], 'message');
chain = customCheck('foo', (value, { req, location, path }) => {
  return location + path + value + req.baseUrl;
});