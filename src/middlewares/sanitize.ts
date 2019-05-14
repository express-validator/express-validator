import {
  SanitizersImpl,
  SanitizationChain,
} from '../chain';
import { Context } from '../context';
import { Location, InternalRequest, contextsSymbol } from '../base';
import { SelectFields, Sanitize, PersistBack, EnsureInstance, RemoveOptionals, ContextRunner } from '../context-runners';
import { bindAll } from '../utils';

// This list of runners is here so it can be checked/extended by tests
export const defaultRunners: ({ new(): ContextRunner })[] = [
  SelectFields,
  Sanitize,
  RemoveOptionals,
  EnsureInstance,
  PersistBack,
];

export function sanitize(
  fields: string | string[],
  locations: Location[] = [],
): SanitizationChain {
  const context = new Context(
    Array.isArray(fields) ? fields : [fields],
    locations,
  );

  const runners = defaultRunners.map(Runner => new Runner());

  const middleware = async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
    try {
      await runners.reduce(
        async (instances, runner) => runner.run(req, context, await instances),
        Promise.resolve([]),
      );
    } catch (err) {
      return next(err);
    } finally {
      req[contextsSymbol] = (req[contextsSymbol] || []).concat(context);
    }

    next();
  };

  return Object.assign(
    middleware,
    bindAll(new SanitizersImpl(context, middleware as any)),
    { context },
  );
}