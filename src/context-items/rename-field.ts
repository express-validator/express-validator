import { CustomValidator, Meta } from '../base';
import { Context } from '../context';
import { ContextItem } from './context-item';

export class RenameFieldContextItem implements ContextItem {
  message: any;

  constructor(private readonly evaluator: CustomValidator, private readonly negated: boolean) {}

  async run(context: Context, value: any, meta: Meta) {
    try {
      const result = this.evaluator(value, meta);
      const actualResult = await result;
      const isPromise = result && result.then;
      const failed = this.negated ? actualResult : !actualResult;

      // A promise that was resolved only adds an error if negated.
      // Otherwise it always suceeds
      if ((!isPromise && failed) || (isPromise && this.negated)) {
        return;
      }
      // rename field if return type is string
      if (typeof actualResult === 'string') {
        context.renameFieldInstance(actualResult, meta);
      }
    } catch (err) {}
  }
}
