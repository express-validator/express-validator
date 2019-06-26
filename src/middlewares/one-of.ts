import * as _ from 'lodash';
import { ValidationChain } from '../chain';
import { InternalRequest, Middleware, Request, contextsSymbol } from '../base';
import { ContextBuilder } from '../context-builder';

export type OneOfCustomMessageBuilder = (options: { req: Request }) => any;

export function oneOf(
  chains: (ValidationChain | ValidationChain[])[],
  message?: OneOfCustomMessageBuilder,
): Middleware;
export function oneOf(chains: (ValidationChain | ValidationChain[])[], message?: any): Middleware;

export function oneOf(chains: (ValidationChain | ValidationChain[])[], message?: any) {
  return async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
    const surrogateContext = new ContextBuilder().build();

    // Run each group of chains in parallel, and within each group, run each chain in parallel too.
    const promises = chains.map(async chain => {
      const group = Array.isArray(chain) ? chain : [chain];
      const contexts = await Promise.all(
        group.map(chain => chain.run(req, { saveContext: false })),
      );
      const groupErrors = _.flatMap(contexts, 'errors');

      // #536: The data from a chain within oneOf() can only be made available to e.g. matchedData()
      // if its entire group is valid.
      if (!groupErrors.length) {
        contexts.forEach(context => {
          surrogateContext.addFieldInstances(context.getData());
        });
      }

      return groupErrors;
    });

    req[contextsSymbol] = (req[contextsSymbol] || []).concat(surrogateContext);

    try {
      const allErrors = await Promise.all(promises);
      const success = allErrors.some(groupErrors => groupErrors.length === 0);

      if (!success) {
        // Only add an error to the context if no group of chains had success.
        surrogateContext.addError(
          typeof message === 'function' ? message({ req }) : message || 'Invalid value(s)',
          _.flatMap(allErrors),
        );
      }

      next();
    } catch (e) {
      next(e);
    }
  };
}
