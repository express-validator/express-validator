import {
  ContextHandlerImpl,
  ContextRunnerImpl,
  SanitizersImpl,
  ValidationChain,
  ValidatorsImpl,
} from '../chain';
import { InternalRequest, Location, contextsSymbol } from '../base';
import { bindAll } from '../utils';
import { ContextBuilder } from '../context-builder';

export function check(
  fields: string | string[],
  locations: Location[] = [],
  message?: any,
): ValidationChain {
  const builder = new ContextBuilder()
    .setFields(Array.isArray(fields) ? fields : [fields])
    .setLocations(locations)
    .setMessage(message);
  const runner = new ContextRunnerImpl(builder);

  const middleware = async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
    try {
      const context = await runner.run(req);
      req[contextsSymbol] = (req[contextsSymbol] || []).concat(context);
      next();
    } catch (e) {
      next(e);
    }
  };

  return Object.assign(
    middleware,
    bindAll(runner),
    bindAll(new SanitizersImpl(builder, middleware as any)),
    bindAll(new ValidatorsImpl(builder, middleware as any)),
    bindAll(new ContextHandlerImpl(builder, middleware as any)),
    { builder },
  );
}
