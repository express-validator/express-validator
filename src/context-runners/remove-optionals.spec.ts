import { RemoveOptionals } from './remove-optionals';
import { Request } from '../base';
import { Context } from '../context';
import { FieldInstance } from './context-runner';

let req: Request;
let runner: RemoveOptionals;

beforeEach(() => {
  req = {};
  runner = new RemoveOptionals();
});

it('returns same instances if context is compulsory', async () => {
  const oldInstances: FieldInstance[] = [{
    location: 'headers',
    path: 'x-csrf-token',
    originalPath: 'x-csrf-token',
    value: 'bla',
    originalValue: 'bla',
  }];
  const newInstances = await runner.run(req, new Context([], []), oldInstances);

  expect(newInstances).toBe(oldInstances);
});

it('filters out instances whose value are undefined if context can be undefined', async () => {
  const oldInstances: FieldInstance[] = [{
    location: 'headers',
    path: 'x-csrf-token',
    originalPath: 'x-csrf-token',
    value: 'bla',
    originalValue: 'bla',
  }, {
    location: 'headers',
    path: 'content-type',
    originalPath: 'content-type',
    value: undefined,
    originalValue: undefined,
  }];

  const context = new Context([], []);
  context.setOptional();

  const newInstances = await runner.run(req, context, oldInstances);
  expect(newInstances).toHaveLength(1);
  expect(newInstances).toContain(oldInstances[0]);
});

it('filters out instances whose value are null if context can be nullable', async () => {
  const oldInstances: FieldInstance[] = [{
    location: 'headers',
    path: 'x-csrf-token',
    originalPath: 'x-csrf-token',
    value: 'bla',
    originalValue: 'bla',
  }, {
    location: 'headers',
    path: 'content-type',
    originalPath: 'content-type',
    value: null,
    originalValue: null,
  }];

  const context = new Context([], []);
  context.setOptional({ nullable: true });

  const newInstances = await runner.run(req, context, oldInstances);
  expect(newInstances).toHaveLength(1);
  expect(newInstances).toContain(oldInstances[0]);
});

it('filters out instances whose value are undefined if context can be falsy', async () => {
  const oldInstances: FieldInstance[] = [{
    location: 'headers',
    path: 'x-csrf-token',
    originalPath: 'x-csrf-token',
    value: 0,
    originalValue: 0,
  }, {
    location: 'headers',
    path: 'content-type',
    originalPath: 'content-type',
    value: 'bla',
    originalValue: 'bla',
  }, {
    location: 'body',
    path: 'foo.bar',
    originalPath: 'foo.bar',
    value: false,
    originalValue: false,
  }, {
    location: 'query',
    path: 'baz',
    originalPath: 'baz',
    value: '',
    originalValue: '',
  }];

  const context = new Context([], []);
  context.setOptional({ checkFalsy: true });

  const newInstances = await runner.run(req, context, oldInstances);
  expect(newInstances).toHaveLength(1);
  expect(newInstances).toContain(oldInstances[1]);
});
