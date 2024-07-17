import { ContextBuilder } from '../context-builder';
import { Optional } from '../context';
import { ChainCondition, CustomCondition } from '../context-items';
import { CustomValidator } from '../base';
import { Bail } from '../context-items/bail';
import { BailOptions, ContextHandler, OptionalOptions } from './context-handler';
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

  optional(options: OptionalOptions | boolean = true) {
    let value: Optional;
    if (typeof options === 'boolean') {
      value = options ? 'undefined' : false;
    } else {
      value = options.values
        ? options.values
        : options.checkFalsy
        ? 'falsy'
        : options.nullable
        ? 'null'
        : 'undefined';
    }

    this.builder.setOptional(value);
    return this.chain;
  }

  hide(fieldName: string, hiddenValue: string = '********') {
    this.builder.hide(fieldName, hiddenValue)
    return this.chain;
  }
}
