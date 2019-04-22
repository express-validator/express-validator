import {
  ContextHandlerImpl,
  SanitizersImpl,
  ValidatorsImpl,
  ValidationChain
} from '../chain';
import { Context } from '../context';
import { Location, InternalRequest } from '../base';
import { SelectFields, Sanitize, PersistBack, EnsureInstance, RemoveOptionals, Validate, ContextRunner } from '../context-runners';

const bindAll = <T>(object: T) => {
  const protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(object)) as (keyof T)[];
  protoKeys.forEach(key => {
    const maybeFn = object[key];
    if (typeof maybeFn === 'function') {
      object[key] = maybeFn.bind(object);
    }
  });

  return object;
};

// This list of runners is here so it can be checked/extended by tests
export const defaultRunners: ({ new(): ContextRunner })[] = [
  SelectFields,
  Sanitize,
  RemoveOptionals,
  EnsureInstance,
  PersistBack,
  Validate,
];

export function check(
  fields: string | string[],
  locations: Location[] = [],
  message?: any,
): ValidationChain {
  const context = new Context(
    Array.isArray(fields) ? fields : [fields],
    locations,
    message
  );

  const runners = defaultRunners.map(Runner => new Runner());

  const middleware = async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
    try {
      await runners.reduce(
        async (instances, runner) => runner.run(req, context, await instances),
        Promise.resolve([]),
      );
    } catch (err) {
      // We hope to throw only errors from the Validate runner.
      // Anything else means 💥
      if (!Array.isArray(err)) {
        return next(err);
      }

      req._validationErrors = (req._validationErrors || []).concat(err);
    }

    next();
  };

  return Object.assign(
    middleware,
    bindAll(new SanitizersImpl(context, middleware as any)),
    bindAll(new ValidatorsImpl(context, middleware as any)),
    bindAll(new ContextHandlerImpl(context, middleware as any)),
    { context },
  );
}