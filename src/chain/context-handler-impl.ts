import { ContextBuilder } from '../context-builder';
import { Optional } from '../context';
import { CustomCondition } from '../context-items';
import { CustomValidator } from '../base';
import { ContextHandler } from './context-handler';

export class ContextHandlerImpl<Chain> implements ContextHandler<Chain> {
  constructor(private readonly builder: ContextBuilder, private readonly chain: Chain) {}

  if(condition: CustomValidator) {
    this.builder.addItem(new CustomCondition(condition));
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
