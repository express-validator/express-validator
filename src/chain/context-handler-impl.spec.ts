import { Context } from '../context';
import { ContextHandler, ContextHandlerImpl } from './';

let context: Context;
let contextHandler: ContextHandler<any>;

beforeEach(() => {
  context = new Context([], []);
  jest.spyOn(context, 'negate');
  jest.spyOn(context, 'setOptional');

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
    context.addItem({ kind: 'unknown', run: jest.fn() });
    context.addItem({ kind: 'validation', message: 1, run: jest.fn() });

    contextHandler.withMessage('foo');
    expect(context.stack[0]).not.toHaveProperty('message');
    expect(context.stack[1]).toHaveProperty('message', 'foo');
  });

  it('is noop if last item is not a validation', () => {
    context.addItem({ kind: 'validation', message: 1, run: jest.fn() });
    context.addItem({ kind: 'unknown', run: jest.fn() });

    contextHandler.withMessage('foo');
    expect(context.stack[0]).toHaveProperty('message', 1);
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
