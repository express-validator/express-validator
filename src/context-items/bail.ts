import { Context } from '../context';
import { ValidationHalt } from '../base';
import { ContextItem } from './context-item';

export class Bail implements ContextItem {
  run(context: Context) {
    if (context.errors.length > 0) {
      throw new ValidationHalt();
    }

    return Promise.resolve();
  }
}
