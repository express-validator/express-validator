import { ContextRunnerImpl, SanitizationChain, SanitizersImpl } from '../chain';
import { InternalRequest, Location } from '../base';
import { bindAll } from '../utils';
import { ContextBuilder } from '../context-builder';

export function sanitize(
  fields: string | string[] = '',
  locations: Location[] = [],
): SanitizationChain {
  const builder = new ContextBuilder()
    .setFields(Array.isArray(fields) ? fields : [fields])
    .setLocations(locations);
  const runner = new ContextRunnerImpl(builder);

  const middleware = async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
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
    bindAll(new SanitizersImpl(builder, middleware as any)),
    { builder },
  );
}
