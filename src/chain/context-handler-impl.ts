import { CustomValidator } from '../base';
import { Optional } from '../context';
import { ContextBuilder } from '../context-builder';
import { ChainCondition, CustomCondition } from '../context-items';
import { Bail } from '../context-items/bail';
import { Sanitization } from '../context-items/sanitization';
import { BailOptions, ContextHandler } from './context-handler';
import { ContextRunner } from './context-runner';

export class ContextHandlerImpl<Chain> implements ContextHandler<Chain> {
  constructor(private readonly builder: ContextBuilder, private readonly chain: Chain) {}

  bail(opts?: BailOptions) {
    if (opts?.level === 'request') {
      this.builder.setRequestBail();
    }
    this.builder.addItem(new Bail());
    return this.chain;
  }

  if(condition: CustomValidator | ContextRunner) {
    if ('run' in condition) {
      this.builder.addItem(new ChainCondition(condition));
    } else if (typeof condition === 'function') {
      this.builder.addItem(new CustomCondition(condition));
    } else {
      throw new Error('express-validator: condition is not a validation chain nor a function');
    }
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

  default(default_value: any) {
    this.builder.setDefaultValue(default_value);
    const sanitizer = (value: any) => {
      return [undefined, null, NaN, ''].includes(value) ? default_value : value;
    };
    this.builder.addItem(new Sanitization(sanitizer, true));
    return this.chain;
  }
}
