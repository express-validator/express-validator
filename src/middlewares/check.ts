import {
  ContextHandlerImpl,
  ContextRunnerImpl,
  SanitizersImpl,
  ValidationChain,
  ValidatorsImpl,
} from '../chain';
import { Context } from '../context';
import { InternalRequest, Location, contextsSymbol } from '../base';
import { bindAll } from '../utils';

export function check(
  fields: string | string[],
  locations: Location[] = [],
  message?: any,
): ValidationChain {
  const context = new Context(message);
  const runner = new ContextRunnerImpl(
    context,
    Array.isArray(fields) ? fields : [fields],
    locations,
  );

  const middleware = async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
    req[contextsSymbol] = (req[contextsSymbol] || []).concat(context);

    try {
      await runner.run(req);
      next();
    } catch (e) {
      next(e);
    }
  };

  return Object.assign(
    middleware,
    bindAll(runner),
    bindAll(new SanitizersImpl(context, middleware as any)),
    bindAll(new ValidatorsImpl(context, middleware as any)),
    bindAll(new ContextHandlerImpl(context, middleware as any)),
    { context },
  );
}
