import { createMockInstance } from 'jest-create-mock-instance';
import { Context } from '../context';
import { ContextHandler, ContextHandlerImpl } from './';

let context: jest.Mocked<Context>;
let contextHandler: ContextHandler<any>;

beforeEach(() => {
  context = createMockInstance(Context);
  contextHandler = new ContextHandlerImpl(context, {});
});

describe('#not()', () => {
  it('toggles the negate flag on the context', () => {
    contextHandler.not();
    expect(context.negate).toHaveBeenCalled();
  });
});

describe('#withMessage()', () => {
  it('sets the message on the last item on context queue if it is a validation', () => {
    Object.defineProperty(context, 'stack', {
      value: [{ kind: 'unknown' }, { kind: 'validation' }],
    });
    contextHandler.withMessage('foo');
    expect(context.stack[0]).not.toHaveProperty('message');
    expect(context.stack[1]).toHaveProperty('message', 'foo');
  });

  it('is noop if last item is not a validation', () => {
    Object.defineProperty(context, 'stack', {
      value: [{ kind: 'validation' }, { kind: 'unknown' }],
    });
    contextHandler.withMessage('foo');
    expect(context.stack[0]).not.toHaveProperty('message');
    expect(context.stack[1]).not.toHaveProperty('message');
  });
});

describe('#optional()', () => {
  it('toggles optional flags on the context', () => {
    contextHandler.optional();
    expect(context.setOptional).toHaveBeenCalledWith(true);

    contextHandler.optional(true);
    expect(context.setOptional).toHaveBeenCalledWith(true);
  });
});
