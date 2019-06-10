import { ContextRunnerImpl, SanitizationChain, SanitizersImpl } from '../chain';
import { Context } from '../context';
import { InternalRequest, Location, contextsSymbol } from '../base';
import { bindAll } from '../utils';

export function sanitize(fields: string | string[], locations: Location[] = []): SanitizationChain {
  const context = new Context();
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
    { context },
  );
}
