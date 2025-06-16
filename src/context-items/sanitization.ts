import { Context } from '../context';
import { CustomSanitizer, Meta, StandardSanitizer } from '../base';
import { toString as toStringImpl } from '../utils';
import { ContextItem } from './context-item';

export class Sanitization implements ContextItem {
  constructor(
    private readonly sanitizer: StandardSanitizer | CustomSanitizer,
    private readonly custom: boolean,
    private readonly options: any[] = [],
    // For testing only.
    // Deliberately not calling it `toString` in order to not override `Object.prototype.toString`.
    private readonly stringify = toStringImpl,
  ) {}

  async run(context: Context, value: any, meta: Meta) {
    const { path, location } = meta;

    const runCustomSanitizer = async () => {
      const sanitizerValue = this.sanitizer(value, meta);
      return Promise.resolve(sanitizerValue);
    };

    if (this.custom) {
      const newValue = await runCustomSanitizer();
      context.setData(path, newValue, location);
      return;
    }
    const values = Array.isArray(value) ? value : [value];
    const newValues = values.map(value => {
      return (this.sanitizer as StandardSanitizer)(this.stringify(value), ...this.options);
    });

    // We get only the first value of the array if the original value was wrapped.
    context.setData(path, values !== value ? newValues[0] : newValues, location);
  }
}
