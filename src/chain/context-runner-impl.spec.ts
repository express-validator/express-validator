import { Context } from '../context';
import { FieldInstance } from '../base';
import { ContextBuilder } from '../context-builder';
import { ContextItem } from '../context-items';
import { ContextRunnerImpl } from './context-runner-impl';

let builder: ContextBuilder;
let getDataSpy: jest.SpyInstance;
let addFieldInstancesSpy: jest.SpyInstance;
let selectFields: jest.Mock;
let contextRunner: ContextRunnerImpl;

const instances: FieldInstance[] = [
  { location: 'query', path: 'foo', originalPath: 'foo', value: 123, originalValue: 123 },
  { location: 'query', path: 'bar', originalPath: 'bar', value: 456, originalValue: 456 },
];

beforeEach(() => {
  builder = new ContextBuilder().setFields(['foo', 'bar']).setLocations(['query']);
  getDataSpy = jest.spyOn(Context.prototype, 'getData');
  addFieldInstancesSpy = jest.spyOn(Context.prototype, 'addFieldInstances');

  selectFields = jest.fn().mockReturnValue(instances);
  contextRunner = new ContextRunnerImpl(builder, selectFields);
});

afterEach(() => {
  getDataSpy.mockRestore();
  addFieldInstancesSpy.mockRestore();
});

it('selects and adds fields to the context', async () => {
  const req = { query: { foo: 123 } };
  await contextRunner.run(req);

  expect(selectFields).toHaveBeenCalledWith(req, ['foo', 'bar'], ['query']);
  expect(addFieldInstancesSpy).toHaveBeenCalledWith(instances);
});

it('runs validation items on the stack with required data', async () => {
  builder.addItem({ kind: 'validation', message: 1, run: jest.fn() });
  getDataSpy.mockReturnValue(instances);

  const req = { body: { foo: 'bar' } };
  const context = await contextRunner.run(req);

  expect(getDataSpy).toHaveBeenCalledWith({ requiredOnly: true });
  expect(context.stack[0].run).toHaveBeenCalledTimes(instances.length);

  instances.forEach((instance, i) => {
    expect(context.stack[0].run).toHaveBeenNthCalledWith(i + 1, context, instance.value, {
      req,
      location: instance.location,
      path: instance.path,
    });
  });
});

it('runs other items on the stack with all data', async () => {
  builder.addItem({ kind: 'unknown', run: jest.fn() });
  getDataSpy.mockReturnValue(instances);

  const req = { body: { foo: 'bar' } };
  const context = await contextRunner.run(req);

  expect(getDataSpy).toHaveBeenCalledWith({ requiredOnly: false });
  expect(context.stack[0].run).toHaveBeenCalledTimes(instances.length);

  instances.forEach((instance, i) => {
    expect(context.stack[0].run).toHaveBeenNthCalledWith(i + 1, context, instance.value, {
      req,
      location: instance.location,
      path: instance.path,
    });
  });
});

it('runs items on the stack in order', async () => {
  let item1Resolve = () => {};
  const item1Promise = new Promise(resolve => {
    item1Resolve = resolve;
  });
  const item1: ContextItem = {
    kind: 'validation',
    message: 1,
    run: jest.fn().mockReturnValueOnce(item1Promise),
  };

  let item2Resolve = () => {};
  const item2Promise = new Promise(resolve => {
    item2Resolve = resolve;
  });
  const item2: ContextItem = { kind: 'unknown', run: jest.fn().mockReturnValueOnce(item2Promise) };

  builder.addItem(item1, item2);
  getDataSpy.mockReturnValue(instances);
  const resultPromise = contextRunner.run({});

  // Item 2 hasn't run yet -- the item 1's promise hasn't resolved
  expect(item1.run).toHaveBeenCalledTimes(2);
  expect(item2.run).not.toHaveBeenCalled();

  item1Resolve();

  // Make sure whatever promises are still pending are flushed by awaiting on one
  // that will be completed on the next tick
  await new Promise(resolve => setTimeout(resolve));

  // Item 1 hasn't run any more times. Item 2 has got the green signal to run.
  expect(item1.run).toHaveBeenCalledTimes(2);
  expect(item2.run).toHaveBeenCalledTimes(2);

  // Item 2 is resolved, then so should the context runner
  item2Resolve();
  return resultPromise;
});
