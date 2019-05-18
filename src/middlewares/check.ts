import { ContextHandlerImpl, SanitizersImpl, ValidationChain, ValidatorsImpl } from '../chain';
import { Context } from '../context';
import {
  InternalRequest,
  Location,
  contextsSymbol,
  errorsSymbol,
  middlewareModeSymbol,
} from '../base';
import {
  ContextRunner,
  EnsureInstance,
  PersistBack,
  RemoveOptionals,
  Sanitize,
  SelectFields,
  Validate,
} from '../context-runners';
import { bindAll } from '../utils';

// This list of runners is here so it can be checked/extended by tests
export const defaultRunners: ({ new (): ContextRunner })[] = [
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
  const context = new Context(Array.isArray(fields) ? fields : [fields], locations, message);

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
      if (req[middlewareModeSymbol] || !Array.isArray(err)) {
        return next(err);
      }

      req[errorsSymbol] = (req[errorsSymbol] || []).concat(err);
    } finally {
      req[contextsSymbol] = (req[contextsSymbol] || []).concat(context);
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
