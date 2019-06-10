import * as _ from 'lodash';
import { ValidationChain } from '../chain';
import { InternalRequest, Middleware, Request, ValidationError, contextsSymbol } from '../base';
import { Context } from '../context';

export type OneOfCustomMessageBuilder = (options: { req: Request }) => any;

export function oneOf(
  chains: (ValidationChain | ValidationChain[])[],
  message?: OneOfCustomMessageBuilder,
): Middleware;
export function oneOf(chains: (ValidationChain | ValidationChain[])[], message?: any): Middleware;

export function oneOf(chains: (ValidationChain | ValidationChain[])[], message?: any) {
  return async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
    const surrogateContext = new Context();

    // Run each group of chains in parallel, and within each group, run each chain in parallel too.
    const promises = chains.map(async chain => {
      const group = Array.isArray(chain) ? chain : [chain];
      let groupErrors: ValidationError[] = [];

      const groupPromises = group.map(async chain => {
        await chain.run(req);
        groupErrors = groupErrors.concat(chain.context.errors);
      });
      await Promise.all(groupPromises);

      // #536: The data from a chain within oneOf() can only be made available to e.g. matchedData()
      // if its entire group is valid.
      if (!groupErrors.length) {
        group.forEach(chain => {
          surrogateContext.addFieldInstances(chain.context.getData());
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
