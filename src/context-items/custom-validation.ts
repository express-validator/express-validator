import { CustomValidator, Meta } from '../base';
import { Context } from '../context';
import { ContextItem } from './context-item';

export class CustomValidation implements ContextItem {
  message: any;

  constructor(private readonly validator: CustomValidator, private readonly negated: boolean) {}

  async run(context: Context, value: any, meta: Meta) {
    try {
      const result = this.validator(value, meta);
      const actualResult = await result;
      const isPromise = result && result.then;
      const failed = this.negated ? actualResult : !actualResult;

      // A promise that was resolved only adds an error if negated.
      // Otherwise it always suceeds
      if ((!isPromise && failed) || (isPromise && this.negated)) {
        context.addError(this.message, value, meta);
      }
    } catch (err) {
      if (this.negated) {
        return;
      }

      context.addError(this.message || (err instanceof Error ? err.message : err), value, meta);
    }
  }
}
