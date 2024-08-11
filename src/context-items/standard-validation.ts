import { Meta, StandardValidator } from '../base';
import { toString as toStringImpl } from '../utils';
import { Context } from '../context';
import { ContextItem } from './context-item';

export class StandardValidation implements ContextItem {
  message: any;

  constructor(
    private readonly validator: StandardValidator,
    private readonly negated: boolean,
    private readonly options: any[] = [],
    // For testing only.
    // Deliberately not calling it `toString` in order to not override `Object.prototype.toString`.
    private readonly stringify = toStringImpl,
  ) {}

  async run(context: Context, value: any, meta: Meta) {
    const values = Array.isArray(value) ? value : [value];
    values.forEach(value => {
      const result = this.validator(this.stringify(value), ...this.options);
      if (this.negated ? result : !result) {
        context.addError({ type: 'field', message: this.message, value, meta });
      }
    });
  }
}
