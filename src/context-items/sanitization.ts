import * as _ from 'lodash';
import { UnknownContextItem } from './context-item';
import { Context } from '../context';
import { CustomSanitizer, Meta, StandardSanitizer } from '../base';
import { toString } from '../utils';

export class Sanitization implements UnknownContextItem {
  readonly kind = 'unknown';

  constructor(
    private readonly context: Context,
    private readonly sanitizer: StandardSanitizer | CustomSanitizer,
    private readonly custom: boolean,
    private readonly options: any[] = [],
  ) {}

  async run(value: any, meta: Meta) {
    const { req, path, location } = meta;

    const newValue = this.custom
      ? (this.sanitizer as CustomSanitizer)(value, meta)
      : (this.sanitizer as StandardSanitizer)(toString(value), ...this.options);

    this.context.setData(path, newValue, location);

    // Checks whether the value changed.
    // Avoids e.g. undefined values being set on the request if it didn't have the key initially.
    const reqValue = path !== '' ? _.get(req[location], path) : req[location];
    if (reqValue !== newValue) {
      path !== '' ? _.set(req[location], path, newValue) : _.set(req, location, newValue);
    }
  }
}
