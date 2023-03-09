import { Meta, RenameEvaluator } from '../base';
import { Context } from '../context';
import { ContextItem } from './context-item';

export class RenameFieldContextItem implements ContextItem {
  constructor(private readonly evaluator: RenameEvaluator | string) {}

  async run(context: Context, value: any, meta: Meta) {
    try {
      // short circuit if the evaluator is string
      if (typeof this.evaluator === 'string') {
        return context.renameFieldInstance(this.evaluator, meta);
      }
      const result = this.evaluator(value, meta);
      const actualResult = await result;

      if (typeof actualResult !== 'string' || actualResult.length < 1) {
        return;
      }
      context.renameFieldInstance(actualResult, meta);
    } catch (err) {}
  }
}
