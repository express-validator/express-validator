import { EnsureInstance } from './ensure-instance';
import { Request } from '../base';
import { Context } from '../context';
import { FieldInstance } from './context-runner';

let req: Request;
let runner: EnsureInstance;
beforeEach(() => {
  req = {};
  runner = new EnsureInstance();
});

it('keeps instances whose originalPath is unique', async () => {
  const oldInstances: FieldInstance[] = [{
    location: 'query',
    path: 'foo',
    originalPath: 'foo',
    value: 123,
    originalValue: 123,
  }, {
    location: 'query',
    path: 'bar',
    originalPath: 'bar',
    value: true,
    originalValue: true,
  }];

  const newInstances = await runner.run(req, new Context([], []), oldInstances);
  expect(newInstances).toHaveLength(2);
  expect(newInstances).toContain(oldInstances[0]);
  expect(newInstances).toContain(oldInstances[1]);
});

it('keeps instances whose originalPath has a wildcard', async () => {
  const oldInstances: FieldInstance[] = [{
    location: 'body',
    path: 'foo[0].bar',
    originalPath: 'foo.*.bar',
    value: 123,
    originalValue: 123,
  }, {
    location: 'body',
    path: 'foo[1].bar',
    originalPath: 'foo.*.bar',
    value: undefined,
    originalValue: undefined,
  }];

  const newInstances = await runner.run(req, new Context([], []), oldInstances);
  expect(newInstances).toHaveLength(2);
  expect(newInstances).toContain(oldInstances[0]);
  expect(newInstances).toContain(oldInstances[1]);
});

it('keeps instances whose value is undefined and there is a single location', async () => {
  const oldInstances: FieldInstance[] = [{
    location: 'body',
    path: 'foo',
    originalPath: 'foo',
    value: undefined,
    originalValue: undefined,
  }];

  const newInstances = await runner.run(req, new Context([], ['body']), oldInstances);
  expect(newInstances).toHaveLength(1);
  expect(newInstances).toContain(oldInstances[0]);
});

it('filters out instances whose value is undefined and there are multiple locations', async () => {
  const oldInstances: FieldInstance[] = [{
    location: 'body',
    path: 'foo',
    originalPath: 'foo',
    value: undefined,
    originalValue: undefined,
  }, {
    location: 'query',
    path: 'foo',
    originalPath: 'foo',
    value: 'bar',
    originalValue: 'bar',
  }];

  const newInstances = await runner.run(req, new Context([], ['body', 'query']), oldInstances);
  expect(newInstances).toHaveLength(1);
  expect(newInstances).toContain(oldInstances[1]);
});

it('keeps one instance whose value is undefined when there are multiple locations', async () => {
  const oldInstances: FieldInstance[] = [{
    location: 'body',
    path: 'foo',
    originalPath: 'foo',
    value: undefined,
    originalValue: undefined,
  }, {
    location: 'query',
    path: 'foo',
    originalPath: 'foo',
    value: undefined,
    originalValue: undefined,
  }];

  const newInstances = await runner.run(req, new Context([], ['body', 'query']), oldInstances);
  expect(newInstances).toHaveLength(1);
  expect(newInstances).toContain(oldInstances[0]);
});