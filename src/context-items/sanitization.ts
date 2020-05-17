import { Context } from '../context';
import { CustomSanitizer, Meta, StandardSanitizer } from '../base';
import { toString } from '../utils';
import { ContextItem } from './context-item';

export class Sanitization implements ContextItem {
  constructor(
    private readonly sanitizer: StandardSanitizer | CustomSanitizer,
    private readonly custom: boolean,
    private readonly options: any[] = [],
  ) {}

  async run(context: Context, value: any, meta: Meta) {
    const { path, location } = meta;

    const newValue = this.custom
      ? (this.sanitizer as CustomSanitizer)(value, meta)
      : (this.sanitizer as StandardSanitizer)(toString(value), ...this.options);

    context.setData(path, newValue, location);
  }
}
