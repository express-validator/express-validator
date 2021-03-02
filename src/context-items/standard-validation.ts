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
    const values = Array.isArray(value) ? value : [value];
    values.forEach(value => {
      const result = this.validator(toString(value), ...this.options);
      if (this.negated ? result : !result) {
        context.addError(this.message, value, meta);
      }
    });
  }
}
