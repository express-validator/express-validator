import {
  InternalRequest,
  Location,
  Middleware,
  Request,
  UnknownFieldInstance,
  contextsKey,
} from '../base';
import { ContextRunner, ResultWithContextImpl, ValidationChain } from '../chain';
import { Context } from '../context';
import { selectUnknownFields } from '../field-selection';

type CheckExactOptions = {
  /**
   * The list of locations which `checkExact()` should check.
   * @default ['body', 'params', 'query']
   */
  locations?: readonly Location[];
};

/**
 * Checks whether the request contains exactly only those fields that have been validated.
 *
 * Unknown fields, if found, will generate an error of type `unknown_fields`.
 *
 * @param chains either a single chain, an array of chains, or a mixed array of chains and array of chains.
 *               This means that all of the below are valid:
 * ```
 * checkExact(check('foo'))
 * checkExact([check('foo'), check('bar')])
 * checkExact([check('foo'), check('bar')])
 * checkExact(checkSchema({ ... }))
 * checkExact([checkSchema({ ... }), check('foo')])
 * ```
 * @param opts
 */
export function checkExact(
  chains?: ValidationChain | ValidationChain[] | (ValidationChain | ValidationChain[])[],
  opts?: CheckExactOptions,
): Middleware & ContextRunner {
  // Don't include all locations by default. Browsers will add cookies and headers that the user
  // might not want to validate, which would be a footgun.
  const locations = opts?.locations || ['body', 'params', 'query'];
  const chainsArr = Array.isArray(chains) ? chains.flat() : chains ? [chains] : [];

  const run = async (req: Request) => {
    const internalReq = req as InternalRequest;

    const fieldsByLocation = new Map<Location, string[]>();
    const promises = chainsArr.map(async chain => chain.run(req));
    await Promise.all(promises);

    // The chains above will have added contexts to the request
    (internalReq[contextsKey] || []).forEach(context => {
      context.locations.forEach(location => {
        if (!locations.includes(location)) {
          return;
        }

        const locationFields = fieldsByLocation.get(location) || [];
        locationFields.push(...context.fields);
        fieldsByLocation.set(location, locationFields);
      });
    });

    // when none of the chains matched anything, then everything is unknown.
    if (!fieldsByLocation.size) {
      locations.forEach(location => fieldsByLocation.set(location, []));
    }

    let unknownFields: UnknownFieldInstance[] = [];
    for (const [location, fields] of fieldsByLocation.entries()) {
      unknownFields = unknownFields.concat(selectUnknownFields(req, fields, [location]));
    }

    const context = new Context([], [], [], false);
    if (unknownFields.length) {
      context.addError({
        type: 'unknown_fields',
        req,
        fields: unknownFields,
      });
    }
    internalReq[contextsKey] = internalReq[contextsKey] || [];
    internalReq[contextsKey]!.push(context);
    return new ResultWithContextImpl(context);
  };

  const middleware: Middleware = (req, _res, next) => run(req).then(() => next(), next);
  return Object.assign(middleware, { run });
}
