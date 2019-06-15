import { Context } from '../context';
import { SelectFields } from '../select-fields';
import { ContextRunnerImpl } from './context-runner-impl';
import { FieldInstance } from '../base';

let context: Context;
let getDataMock: jest.Mock;
let selectFields: jest.Mock<ReturnType<SelectFields>, Parameters<SelectFields>>;
let contextRunner: ContextRunnerImpl;

const instances: FieldInstance[] = [
  { location: 'query', path: 'foo', originalPath: 'foo', value: 123, originalValue: 123 },
  { location: 'query', path: 'bar', originalPath: 'bar', value: 456, originalValue: 456 },
];

beforeEach(() => {
  context = new Context(['foo', 'bar'], ['query']);
  getDataMock = jest.fn();
  context.getData = getDataMock;
  jest.spyOn(context, 'addFieldInstances');

  selectFields = jest.fn().mockReturnValue(instances);
  contextRunner = new ContextRunnerImpl(context, selectFields);
});

it('selects and adds fields to the context', async () => {
  const req = { query: { foo: 123 } };
  await contextRunner.run(req);

  expect(selectFields).toHaveBeenCalledWith(req, ['foo', 'bar'], ['query']);
  expect(context.addFieldInstances).toHaveBeenCalledWith(instances);
});

it('runs validation items on the stack with required data', async () => {
  context.addItem({ kind: 'validation', message: 1, run: jest.fn() });
  getDataMock.mockReturnValue(instances);

  const req = { body: { foo: 'bar' } };
  await contextRunner.run(req);

  expect(getDataMock).toHaveBeenCalledWith({ requiredOnly: true });
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
  context.addItem({ kind: 'unknown', run: jest.fn() });
  getDataMock.mockReturnValue(instances);

  const req = { body: { foo: 'bar' } };
  await contextRunner.run(req);

  expect(getDataMock).toHaveBeenCalledWith({ requiredOnly: false });
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
  let item2Resolve = () => {};
  const item1Promise = new Promise(resolve => {
    item1Resolve = resolve;
  });
  const item2Promise = new Promise(resolve => {
    item2Resolve = resolve;
  });

  context.addItem({
    kind: 'validation',
    message: 1,
    run: jest.fn().mockReturnValueOnce(item1Promise),
  });
  context.addItem({ kind: 'unknown', run: jest.fn().mockReturnValueOnce(item2Promise) });

  getDataMock.mockReturnValue(instances);
  const resultPromise = contextRunner.run({});

  // Item 2 hasn't run yet -- the item 1's promise hasn't resolved
  expect(context.stack[0].run).toHaveBeenCalledTimes(2);
  expect(context.stack[1].run).not.toHaveBeenCalled();

  item1Resolve();

  // Make sure whatever promises are still pending are flushed by awaiting on one
  // that will be completed on the next tick
  await new Promise(resolve => setTimeout(resolve));

  // Item 1 hasn't run any more times. Item 2 has got the green signal to run.
  expect(context.stack[0].run).toHaveBeenCalledTimes(2);
  expect(context.stack[1].run).toHaveBeenCalledTimes(2);

  // Item 2 is resolved, then so should the context runner
  item2Resolve();
  return resultPromise;
});
