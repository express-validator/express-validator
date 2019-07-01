import { CustomValidator, Meta, ValidationHalt } from '../base';
import { Context } from '../context';
import { ContextItem } from './context-item';

export class CustomCondition implements ContextItem {
  constructor(private readonly condition: CustomValidator) {}

  async run(_context: Context, value: any, meta: Meta) {
    try {
      const result = this.condition(value, meta);
      await result;

      // if the promise resolved or the result is truthy somehow, then there's no validation halt.
      if (!result) {
        // the error thrown here is symbolic, it will be re-thrown in the catch clause anyway.
        throw new Error();
      }
    } catch (e) {
      throw new ValidationHalt();
    }
  }
}
