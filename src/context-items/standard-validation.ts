import { Meta, StandardValidator } from '../base';
import { toString } from '../utils';
import { Context } from '../context';
import { ContextItem } from './context-item';

export class StandardValidation implements ContextItem {
  message: any;

  constructor(
    private readonly validator: StandardValidator,
    private readonly negated: boolean,
    private readonly options: any[] = [],
  ) {}

  async run(context: Context, value: any, meta: Meta) {
    const result = this.validator(toString(value), ...this.options);
    if (this.negated ? result : !result) {
      // null values will always fail validation so we must
      // check if our context allows nullable values
      if (context.optional && context.optional.nullable && value == null) {
        return;
      }
      context.addError(this.message, value, meta);
    }
  }
}
