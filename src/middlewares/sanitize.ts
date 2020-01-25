import { ContextRunnerImpl, SanitizationChain, SanitizersImpl } from '../chain';
import { InternalRequest, Location } from '../base';
import { bindAll } from '../utils';
import { ContextBuilder } from '../context-builder';

let hasNotified = false;

export function sanitize(
  fields: string | string[] = '',
  locations: Location[] = [],
): SanitizationChain {
  if (!hasNotified) {
    hasNotified = true;
    console.warn(
      'express-validator: sanitize(), sanitizeBody() and other sanitization-only middlewares ' +
        'have been deprecated.\nPlease use check(), body() and others instead, which must offer ' +
        'the same API, and more.',
    );
  }

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
