import { Context } from "../context";
import { PersistBack } from "./persist-back";
import { FieldInstance } from "./context-runner";

let context: Context;
let runner: PersistBack;
beforeEach(() => {
  context = new Context([], ['body']);
  runner = new PersistBack();
});

it('persists current selected instances back on req', () => {
  const req = {
    body: {},
    query: {},
    cookies: {},
  };

  const instances: FieldInstance[] = [{
    location: 'body',
    path: 'foo',
    originalPath: 'foo',
    value: 'foo',
    originalValue: 'bar',
  }, {
    location: 'query',
    path: 'bar',
    originalPath: 'bar',
    value: 123,
    originalValue: '123',
  }, {
    location: 'cookies',
    path: 'baz.qux',
    originalPath: 'baz.qux',
    value: { some: 'value' },
    originalValue: '{some:value}',
  }]
  const retValue = runner.run(req, context, instances);

  expect(req.body).toHaveProperty('foo', 'foo');
  expect(req.query).toHaveProperty('bar', 123);
  expect(req.cookies).toHaveProperty('baz.qux', { some: 'value' });
  return expect(retValue).resolves.toBe(instances);
});

it('overrides location if path is empty', () => {
  const req = { body: 'foobar' };
  runner.run(req, context, [{
    location: 'body',
    path: '',
    originalPath: '',
    value: { bar: 1 },
    originalValue: 'foobar',
  }]);

  expect(req.body).toEqual({ bar: 1 });
});

it('does not set undefined values when keys do not exist', () => {
  const req = { params: {} };
  runner.run(req, context, [{
    location: 'params',
    path: 'foo',
    originalPath: 'foo',
    value: undefined,
    originalValue: undefined,
  }]);

  expect(req.params).not.toHaveProperty('foo');
});