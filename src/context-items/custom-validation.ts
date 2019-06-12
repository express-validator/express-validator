import { CustomValidator, Meta } from '../base';
import { Context } from '../context';
import { ValidationContextItem } from './context-item';

export class CustomValidation implements ValidationContextItem {
  readonly kind = 'validation';
  private readonly negated: boolean;
  message: any;

  constructor(private readonly context: Context, private readonly validator: CustomValidator) {
    this.negated = context.negated;
  }

  async run(value: any, meta: Meta) {
    try {
      const result = this.validator(value, meta);
      const actualResult = await result;
      const isPromise = result && result.then;
      const failed = this.negated ? actualResult : !actualResult;

      if (!isPromise && failed) {
        this.context.addError(this.message, value, meta);
      }
    } catch (err) {
      this.context.addError(
        (err instanceof Error ? err.message : err) || this.message,
        value,
        meta,
      );
    }
  }
}
