import { ContextBuilder } from '../context-builder';
import { ChainCondition, CustomCondition } from '../context-items';
import { check } from '../middlewares/check';
import { Bail } from '../context-items/bail';
import { ContextHandler, ContextHandlerImpl } from './';

let builder: ContextBuilder;
let contextHandler: ContextHandler<any>;

beforeEach(() => {
  builder = new ContextBuilder();
  jest.spyOn(builder, 'setOptional');
  jest.spyOn(builder, 'setRequestBail');
  jest.spyOn(builder, 'addItem');
  jest.spyOn(builder, 'setHidden');

  contextHandler = new ContextHandlerImpl(builder, {});
});

describe('#bail()', () => {
  it('adds a Bail item', () => {
    contextHandler.bail();
    expect(builder.addItem).toHaveBeenCalledWith(new Bail());
  });

  it('does not set request bail if level is unset or set to chain', () => {
    contextHandler.bail({});
    contextHandler.bail({ level: 'chain' });
    expect(builder.setRequestBail).not.toHaveBeenCalled();
  });

  it('sets request bail if level is set to request', () => {
    contextHandler.bail({ level: 'request' });
    expect(builder.setRequestBail).toHaveBeenCalled();
  });
});

describe('#if()', () => {
  it('adds a CustomCondition item', () => {
    const condition = () => true;
    contextHandler.if(condition);
    expect(builder.addItem).toHaveBeenCalledWith(new CustomCondition(condition));
  });

  it('adds a ChainCondition item', () => {
    const condition = check();
    contextHandler.if(condition);
    expect(builder.addItem).toHaveBeenCalledWith(new ChainCondition(condition));
  });

  it('throws if condition is not of a known type', () => {
    const bomb = () => contextHandler.if({} as any);
    expect(bomb).toThrowError();
    expect(builder.addItem).not.toHaveBeenCalled();
  });
});

describe('#optional()', () => {
  it('sets optional flag to undefined if arg is true', () => {
    contextHandler.optional();
    expect(builder.setOptional).toHaveBeenNthCalledWith(1, 'undefined');

    contextHandler.optional(true);
    expect(builder.setOptional).toHaveBeenNthCalledWith(2, 'undefined');
  });

  it('sets optional flag to arg value', () => {
    contextHandler.optional({ nullable: true });
    expect(builder.setOptional).toHaveBeenNthCalledWith(1, 'null');

    contextHandler.optional({ checkFalsy: true });
    expect(builder.setOptional).toHaveBeenNthCalledWith(2, 'falsy');

    contextHandler.optional(false);
    expect(builder.setOptional).toHaveBeenNthCalledWith(3, false);
  });
});

describe('#hide()', () => {
  it('sets the hidden flag to true with no hidden value', () => {
    contextHandler.hide();
    expect(builder.setHidden).toHaveBeenCalledWith(true, undefined);
  });

  it('sets the hidden flag to true with a hidden value', () => {
    contextHandler.hide('hidden_value');
    expect(builder.setHidden).toHaveBeenCalledWith(true, 'hidden_value');
  });
});
