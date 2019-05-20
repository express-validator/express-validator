import { Context } from '../context';
import { toString } from '../utils';
import { ContextRunner, FieldInstance } from './context-runner';

export class Sanitize implements ContextRunner {
  async run(req: any, context: Context, instances: FieldInstance[]) {
    return instances.map(instance => {
      const value = context.sanitizations.reduce((prevValue, sanitization) => {
        // TypeScript can't do type inference without `if (custom === false)`
        if (sanitization.custom === false) {
          return sanitization.sanitizer(toString(prevValue), ...sanitization.options);
        }

        return sanitization.sanitizer(prevValue, {
          req,
          location: instance.location,
          path: instance.path,
        });
      }, instance.value);

      return { ...instance, value };
    });
  }
}
