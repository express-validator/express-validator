import { ValidationContextItem } from './context-item';
import { Meta, StandardValidator } from '../base';
import { toString } from '../utils';
import { Context } from '../context';

export class StandardValidation implements ValidationContextItem {
  readonly kind = 'validation';
  private readonly negated: boolean;
  message: any;

  constructor(
    private readonly context: Context,
    private readonly validator: StandardValidator,
    private readonly options: any[] = [],
  ) {
    this.negated = context.negated;
  }

  async run(value: any, meta: Meta) {
    const result = this.validator(toString(value), ...this.options);
    if (this.negated ? result : !result) {
      this.context.addError(this.message, value, meta);
    }
  }
}
