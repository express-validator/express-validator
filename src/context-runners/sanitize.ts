import { Context } from "../context";
import { ContextRunner, FieldInstance } from "./context-runner";

export class Sanitize implements ContextRunner {
  async run(req: any, context: Context, instances: FieldInstance[]) {
    return instances.map(instance => {
      const value = context.sanitizations.reduce((prevValue, sanitization) => {
        // FIXME https://github.com/express-validator/express-validator/issues/580
        if (typeof prevValue !== 'string') {
          return prevValue;
        }

        if (sanitization.custom) {
          return sanitization.sanitizer(prevValue, {
            req,
            location: instance.location,
            path: instance.path,
          });

        // TypeScript can't do type inference without `if (custom === false)`
        } else if (sanitization.custom === false) {
          return sanitization.sanitizer(prevValue, ...sanitization.options);
        }
      }, instance.value);

      return { ...instance, value };
    });
  }
}