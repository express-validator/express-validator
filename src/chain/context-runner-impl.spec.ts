import { Context } from '../context';
import { FieldInstance, InternalRequest, ValidationHalt, contextsKey } from '../base';
import { ContextBuilder } from '../context-builder';
import { ContextItem } from '../context-items';
import { Result } from '../validation-result';
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

// Used in value persistence tests
const nullify: ContextItem = {
  async run(context, _value, { location, path }) {
    context.setData(path, undefined, location);
  },
};

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

it('returns Result for current context', async () => {
  builder.addItem({
    async run(context, value, meta) {
      context.addError('some error', value, meta);
    },
  });
  const result = await contextRunner.run({});
  expect(result).toBeInstanceOf(Result);
  expect(result.array()).toHaveLength(2);
});

it('selects and adds fields to the context', async () => {
  const req = { query: { foo: 123 } };
  await contextRunner.run(req);

  expect(selectFields).toHaveBeenCalledWith(req, ['foo', 'bar'], ['query']);
  expect(addFieldInstancesSpy).toHaveBeenCalledWith(instances);
});

it('runs items on the stack with required data', async () => {
  builder.addItem({ run: jest.fn() }, { run: jest.fn() });
  getDataSpy.mockReturnValue(instances);

  const req = { body: { foo: 'bar' } };
  const { context } = await contextRunner.run(req);

  context.stack.forEach((item, i) => {
    expect(getDataSpy).toHaveBeenNthCalledWith(i + 1, { requiredOnly: true });
    expect(item.run).toHaveBeenCalledTimes(instances.length);

    instances.forEach((instance, j) => {
      expect(item.run).toHaveBeenNthCalledWith(j + 1, context, instance.value, {
        req,
        location: instance.location,
        path: instance.path,
      });
    });
  });
});

it('runs items on the stack in order', async () => {
  let item1Resolve = () => {};
  const item1Promise = new Promise<void>(resolve => {
    item1Resolve = resolve;
  });
  const item1: ContextItem = { run: jest.fn().mockReturnValueOnce(item1Promise) };

  let item2Resolve = () => {};
  const item2Promise = new Promise<void>(resolve => {
    item2Resolve = resolve;
  });
  const item2: ContextItem = { run: jest.fn().mockReturnValueOnce(item2Promise) };

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

it('stops running items on paths that got a validation halt', async () => {
  builder.addItem(
    {
      run: jest.fn().mockImplementationOnce(() => {
        throw new ValidationHalt();
      }),
    },
    { run: jest.fn() },
  );
  getDataSpy.mockReturnValue(instances);

  const req = { body: { foo: 'bar' } };
  const { context } = await contextRunner.run(req);

  expect(context.stack[1].run).toHaveBeenCalledTimes(1);
  expect(context.stack[1].run).toHaveBeenCalledWith(context, instances[1].value, {
    req,
    location: instances[1].location,
    path: instances[1].path,
  });
});

it('rethrows unexpected errors', async () => {
  const item1 = jest.fn().mockImplementationOnce(() => {
    throw new Error();
  });
  builder.addItem({ run: item1 });
  getDataSpy.mockReturnValue(instances);

  await expect(contextRunner.run({ body: {} })).rejects.toThrowError();
  expect(item1).toHaveBeenCalled();
});

it('concats to req[contextsKey]', async () => {
  const req: InternalRequest = {};
  const { context: context1 } = await contextRunner.run(req);
  const { context: context2 } = await contextRunner.run(req);

  expect(req[contextsKey]).toHaveLength(2);
  expect(req[contextsKey]).toEqual([context1, context2]);
});

describe('instance value persistence onto request', () => {
  beforeEach(() => {
    builder.addItem(nullify);
  });

  it('happens on instance path, if defined', async () => {
    const req = { query: {} };
    await contextRunner.run(req);
    expect(req.query).toHaveProperty('foo', undefined);
    expect(req.query).toHaveProperty('bar', undefined);
  });

  it('happens on request location, if path empty', async () => {
    selectFields.mockReturnValue([
      { location: 'query', path: '', originalPath: '', value: 123, originalValue: 123 },
    ]);

    const req = { query: {} };
    await contextRunner.run(req);
    expect(req.query).toBe(undefined);
  });

  it('does not happen if value did not change', async () => {
    selectFields.mockReturnValue([
      { location: 'query', path: 'foo', originalPath: 'foo', value: '123', originalValue: 123 },
    ]);
    const req = { query: {} };
    await contextRunner.run(req);
    expect(req.query).not.toHaveProperty('foo');
  });
});

describe('with dryRun: true option', () => {
  it('does not concat to req[contextsKey]', async () => {
    const req: InternalRequest = {};
    const { context } = await contextRunner.run(req);
    await contextRunner.run(req, { dryRun: true });

    expect(req[contextsKey]).toHaveLength(1);
    expect(req[contextsKey]).toEqual([context]);
  });

  it('does not persist instance value back into the request', async () => {
    builder.addItem(nullify);

    const req = { query: { foo: 123, bar: 456 } };
    await contextRunner.run(req, { dryRun: true });
    expect(req.query).toHaveProperty('foo', 123);
    expect(req.query).toHaveProperty('bar', 456);
  });
});
