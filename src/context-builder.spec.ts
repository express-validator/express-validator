import { ContextBuilder } from './context-builder';
import { ContextItem } from './context-items';

let builder: ContextBuilder;
beforeEach(() => {
  builder = new ContextBuilder();
});

describe('#setFields()', () => {
  it('builds a Context with the given fields', () => {
    const context = builder.setFields(['foo', 'bar']).build();
    expect(context.fields).toEqual(['foo', 'bar']);
  });
});

describe('#setLocations()', () => {
  it('builds a Context with the given location', () => {
    const context = builder.setLocations(['query', 'headers']).build();
    expect(context.locations).toEqual(['query', 'headers']);
  });
});

describe('#setMessage()', () => {
  it('builds a Context with the given message', () => {
    const context = builder.setMessage({ funny: true }).build();
    expect(context.message).toEqual({ funny: true });
  });
});

describe('#setOptional()', () => {
  it('builds a Context with the given optional flag', () => {
    let context = builder.setOptional({ checkFalsy: true, nullable: false }).build();
    expect(context.optional).toEqual({ checkFalsy: true, nullable: false });

    context = builder.setOptional(false).build();
    expect(context.optional).toBe(false);
  });
});

describe('#addItem()', () => {
  it('builds a Context with all the item pushed to the stack', () => {
    const item1: ContextItem = {
      run: () => Promise.resolve(),
    };
    const item2: ContextItem = {
      run: () => Promise.resolve(),
    };
    builder.addItem(item1).addItem(item2).addItem(item1, item2);

    const context = builder.build();
    expect(context.stack).toHaveLength(4);
    expect(context.stack).toEqual([item1, item2, item1, item2]);
  });
});
