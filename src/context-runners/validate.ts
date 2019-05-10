import { Context } from "../context";
import { ContextRunner, FieldInstance } from "./context-runner";
import { Request, ValidationError } from "../base";

class UnknownError extends Error {
  constructor() {
    super();
  }
}

export function toString(value: any, deep = true): string {
  if (Array.isArray(value) && value.length && deep) {
    return toString(value[0], false);
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (value && typeof value === 'object' && value.toString) {
    return value.toString();
  } else if (value == null || (isNaN(value) && !value.length)) {
    return '';
  }

  return String(value);
}

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
            : validation.validator(toString(value), ...validation.options);

          const actualResult = await result;
          const isPromise = result && result.then;
          const failed = (!validation.negated && !actualResult) || (validation.negated && actualResult);

          // If the result was a promise, and the execution flow reached here, this means the
          // promise didn't throw, so it should succeed.
          if (!isPromise && failed) {
            // #572, #573, #691: Throwing a custom error so that tools like Bluebird don't complain
            throw new UnknownError();
          }
        } catch (err) {
          errors.push({
            location,
            param: path,
            value: instance.originalValue,
            msg: this.getDynamicMessage(req, instance, [
              validation.message,
              err && err.message,
              err instanceof UnknownError ? null : err,
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