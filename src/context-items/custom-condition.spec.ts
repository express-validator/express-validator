import { ContextBuilder } from '../context-builder';
import { ValidationHalt } from '../base';
import { CustomCondition } from './custom-condition';

let condition: jest.Mock;
let runItem: () => Promise<void>;

beforeEach(() => {
  condition = jest.fn();

  const item = new CustomCondition(condition);
  runItem = () =>
    item.run(new ContextBuilder().build(), 'foo', {
      req: {},
      location: 'cookies',
      path: 'foo',
    });
});

it('runs the condition with the value and the meta', () => {
  condition.mockReturnValue(true);
  runItem();

  expect(condition).toHaveBeenCalledWith('foo', {
    req: {},
    location: 'cookies',
    path: 'foo',
  });
});

it('does not throw if the condition is truthy', async () => {
  condition.mockReturnValueOnce(true);
  await expect(runItem()).resolves.toBeUndefined();
});

it('does not throw if the condition is a resolved promise', async () => {
  condition.mockResolvedValue('foo');
  await expect(runItem()).resolves.toBeUndefined();
});

it('throws a validation halt if the condition is falsy', async () => {
  condition.mockReturnValueOnce(false);
  await expect(runItem()).rejects.toThrowError(ValidationHalt);

  condition.mockReturnValueOnce(null);
  await expect(runItem()).rejects.toThrowError(ValidationHalt);
});

it('does not throw if a falsy value is resolved in a Promise', async () => {
  condition.mockResolvedValue(false);
  await expect(runItem()).resolves.toBeUndefined();
});

it('throws a validation halt if the condition is a rejected promise', async () => {
  condition.mockRejectedValue('foo');
  await expect(runItem()).rejects.toThrowError(ValidationHalt);
});

it('throws a validation halt if the condition throws', async () => {
  condition.mockImplementation(() => {
    throw new Error('woops');
  });
  await expect(runItem()).rejects.toThrowError(ValidationHalt);
});
