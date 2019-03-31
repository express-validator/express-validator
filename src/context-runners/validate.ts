import { Context } from "../context";
import { ContextRunner, FieldInstance } from "./context-runner";
import { Request, ValidationError } from "../base";

export class Validate implements ContextRunner {
  async run(req: Request, context: Context, instances: FieldInstance[]) {
    const errors: ValidationError[] = [];
    const promises = instances.map(instance => {
      const { value, path, location } = instance;
      return context.validations.reduce(async (promise, validation) => {
        try {
          await promise;

          const result = validation.custom === true
            ? validation.validator(value, { req, location, path })
            : validation.validator(value, ...validation.options);

          const actualResult = await result;
          const isPromise = result && result.then;
          const failed = (!validation.negated && !actualResult) || (validation.negated && actualResult);

          // If the result was a promise, and the execution flow reached here, this means the
          // promise didn't throw, so it should succeed.
          if (!isPromise && failed) {
            throw null;
          }
        } catch (err) {
          errors.push({
            location,
            param: path,
            value: instance.originalValue,
            msg: this.getDynamicMessage(req, instance, [
              validation.message,
              err && err.message,
              err,
              context.message,
              'Invalid value',
            ]),
          });
        }
      }, Promise.resolve());
    });

    await Promise.all(promises);
    if (errors.length) {
      throw errors;
    } else {
      return instances;
    }
  }

  private getDynamicMessage(req: Request, instance: FieldInstance, messageSources: any[]) {
    const message = messageSources.find(message => !!message);
    if (typeof message !== 'function') {
      return message;
    }

    return message(instance.originalValue, {
      req,
      location: instance.location,
      path: instance.path,
    });
  }

}