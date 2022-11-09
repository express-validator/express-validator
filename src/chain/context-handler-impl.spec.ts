import { ContextBuilder } from '../context-builder';
import { ChainCondition, CustomCondition } from '../context-items';
import { Sanitization } from '../context-items/sanitization';
import { check } from '../middlewares/check';
import { Bail } from '../context-items/bail';
import { Meta } from '../base';
import { ContextHandler, ContextHandlerImpl } from './';

let builder: ContextBuilder;
let contextHandler: ContextHandler<any>;

beforeEach(() => {
  builder = new ContextBuilder();
  jest.spyOn(builder, 'setOptional');
  jest.spyOn(builder, 'setRequestBail');
  jest.spyOn(builder, 'setDefaultValue');
  jest.spyOn(builder, 'addItem');

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

describe('#default()', () => {
  it('adds default() sanitizer to the context', () => {
    contextHandler.default(5);

    expect(builder.addItem).toHaveBeenCalledWith(new Sanitization(expect.any(Function), true));
    expect(builder.setDefaultValue).toHaveBeenCalledWith(5);
  });

  it('sanitizes to default()', async () => {
    contextHandler.default(5);
    const context = builder.build();
    context.addFieldInstances([
      {
        location: 'body',
        path: 'foo',
        originalPath: 'foo',
        value: '',
      },
    ]);

    const meta: Meta = { req: {}, location: 'body', path: 'foo' };
    const defaultSanitizer = context.stack[0];

    await defaultSanitizer.run(context, 'foo', meta);
    expect(context.getData()[0].value).toEqual('foo');

    await defaultSanitizer.run(context, 10, meta);
    expect(context.getData()[0].value).toEqual(10);

    await defaultSanitizer.run(context, '', meta);
    expect(context.getData()[0].value).toEqual(5);

    await defaultSanitizer.run(context, undefined, meta);
    expect(context.getData()[0].value).toEqual(5);

    await defaultSanitizer.run(context, null, meta);
    expect(context.getData()[0].value).toEqual(5);

    await defaultSanitizer.run(context, NaN, meta);
    expect(context.getData()[0].value).toEqual(5);
  });
});
