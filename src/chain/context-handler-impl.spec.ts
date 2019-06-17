import { ContextHandler, ContextHandlerImpl } from './';
import { ContextBuilder } from '../context-builder';

let builder: ContextBuilder;
let contextHandler: ContextHandler<any>;

beforeEach(() => {
  builder = new ContextBuilder();
  jest.spyOn(builder, 'setOptional');

  contextHandler = new ContextHandlerImpl(builder, {});
});

describe('#optional()', () => {
  it('sets optional flag to { checkFalsy: false, nullable: false } if arg is true', () => {
    contextHandler.optional();
    expect(builder.setOptional).toHaveBeenNthCalledWith(1, {
      checkFalsy: false,
      nullable: false,
    });

    contextHandler.optional(true);
    expect(builder.setOptional).toHaveBeenNthCalledWith(2, {
      checkFalsy: false,
      nullable: false,
    });
  });

  it('sets optional flag to arg value', () => {
    contextHandler.optional({ nullable: true });
    expect(builder.setOptional).toHaveBeenNthCalledWith(1, {
      checkFalsy: false,
      nullable: true,
    });

    contextHandler.optional({ checkFalsy: true });
    expect(builder.setOptional).toHaveBeenNthCalledWith(2, {
      checkFalsy: true,
      nullable: false,
    });

    contextHandler.optional(false);
    expect(builder.setOptional).toHaveBeenNthCalledWith(3, false);
  });
});
