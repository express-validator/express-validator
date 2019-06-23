import { ContextBuilder } from '../context-builder';
import { Optional } from '../context';
import { Condition } from '../context-items/condition';
import { CustomValidator } from '../base';
import { ContextHandler } from './context-handler';

export class ContextHandlerImpl<Chain> implements ContextHandler<Chain> {
  constructor(private readonly builder: ContextBuilder, private readonly chain: Chain) {}

  if(condition: CustomValidator) {
    this.builder.addItem(new Condition(condition));
    return this.chain;
  }

  optional(options: Optional | true = true) {
    if (typeof options === 'boolean') {
      this.builder.setOptional(options ? { checkFalsy: false, nullable: false } : false);
    } else {
      this.builder.setOptional({
        checkFalsy: !!options.checkFalsy,
        nullable: !!options.nullable,
      });
    }

    return this.chain;
  }
}
