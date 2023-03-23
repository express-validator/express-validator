import { ErrorMessage, FieldMessageFactory, InternalRequest, Location } from '../base';
import {
  ContextHandlerImpl,
  ContextRunnerImpl,
  SanitizersImpl,
  ValidationChain,
  ValidatorsImpl,
} from '../chain';
import { ContextBuilder } from '../context-builder';
import { bindAll } from '../utils';

export function check(
  fields: string | string[] = '',
  locations: Location[] = [],
  message?: FieldMessageFactory | ErrorMessage,
): ValidationChain {
  const builder = new ContextBuilder()
    .setFields(Array.isArray(fields) ? fields : [fields])
    .setLocations(locations)
    .setMessage(message);
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
    bindAll(new ValidatorsImpl(builder, middleware as any)),
    bindAll(new ContextHandlerImpl(builder, middleware as any)),
    { builder },
  );
}
