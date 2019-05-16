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
  it('sets the message on the last validation of the context', () => {
    Object.defineProperty(context, 'validations', {
      value: [{}, {}],
    });
    contextHandler.withMessage('foo');
    expect(context.validations[0]).not.toHaveProperty('message');
    expect(context.validations[1]).toHaveProperty('message', 'foo');
  });
});

describe('#optional()', () => {
  it('toggles optional flags on the context', () => {
    contextHandler.optional(true);
    expect(context.setOptional).toHaveBeenCalledWith(true);
  });
});
