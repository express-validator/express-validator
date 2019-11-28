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
      const failed = this.negated ? actualResult : !actualResult;
      
      if (failed) {
        context.addError(this.message, value, meta);
      }
    } catch (err) {
      if (this.negated) {
        return;
      }

      context.addError((err instanceof Error ? err.message : err) || this.message, value, meta);
    }
  }
}
