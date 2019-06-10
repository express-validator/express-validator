import { createMockInstance } from 'jest-create-mock-instance';
import { Context } from '../context';
import { SelectFields } from '../select-fields';
import { ContextRunnerImpl } from './context-runner-impl';
import { FieldInstance } from '../base';
import { ContextItem } from '../context-items';

let context: jest.Mocked<Context>;
let selectFields: jest.Mock<ReturnType<SelectFields>, Parameters<SelectFields>>;
let contextRunner: ContextRunnerImpl;
let stack: jest.Mocked<ContextItem>[];

const instances: FieldInstance[] = [
  { location: 'query', path: 'foo', originalPath: 'foo', value: 123, originalValue: 123 },
  { location: 'query', path: 'bar', originalPath: 'bar', value: 456, originalValue: 456 },
];

beforeEach(() => {
  context = createMockInstance(Context);
  stack = [];
  Object.defineProperty(context, 'stack', { get: () => stack });
  selectFields = jest.fn();

  contextRunner = new ContextRunnerImpl(context, ['foo', 'bar'], ['query'], selectFields);
});

it('selects and adds fields to the context', async () => {
  const req = { query: { foo: 123 } };
  selectFields.mockReturnValue(instances);

  await contextRunner.run(req);

  expect(selectFields).toHaveBeenCalledWith(req, ['foo', 'bar'], ['query']);
  expect(context.addFieldInstances).toHaveBeenCalledWith(instances);
});

it('runs validation items on the stack with required data', async () => {
  stack.push({ kind: 'validation', message: 1, run: jest.fn() });
  context.getData.mockReturnValue(instances);

  const req = { body: { foo: 'bar' } };
  await contextRunner.run(req);

  expect(context.getData).toHaveBeenCalledWith({ requiredOnly: true });
  expect(stack[0].run).toHaveBeenCalledTimes(instances.length);

  instances.forEach((instance, i) => {
    expect(stack[0].run).toHaveBeenNthCalledWith(i + 1, instance.value, {
      req,
      location: instance.location,
      path: instance.path,
    });
  });
});

it('runs other items on the stack with all data', async () => {
  stack.push({ kind: 'unknown', run: jest.fn() });
  context.getData.mockReturnValue(instances);

  const req = { body: { foo: 'bar' } };
  await contextRunner.run(req);

  expect(context.getData).toHaveBeenCalledWith({ requiredOnly: false });
  expect(stack[0].run).toHaveBeenCalledTimes(instances.length);

  instances.forEach((instance, i) => {
    expect(stack[0].run).toHaveBeenNthCalledWith(i + 1, instance.value, {
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

  stack.push(
    { kind: 'validation', message: 1, run: jest.fn().mockReturnValueOnce(item1Promise) },
    { kind: 'unknown', run: jest.fn().mockReturnValueOnce(item2Promise) },
  );

  context.getData.mockReturnValue(instances);
  const resultPromise = contextRunner.run({});

  // Item 2 hasn't run yet -- the item 1's promise hasn't resolved
  expect(stack[0].run).toHaveBeenCalledTimes(2);
  expect(stack[1].run).not.toHaveBeenCalled();

  item1Resolve();
  await item1Promise;

  // Item 1 hasn't run any more times. Item 2 has got the green signal to run.
  expect(stack[0].run).toHaveBeenCalledTimes(2);
  expect(stack[1].run).toHaveBeenCalledTimes(2);

  // Item 2 is resolved, then so should the context runner
  item2Resolve();
  return resultPromise;
});
