import * as _ from 'lodash';
import { ContextRunnerImpl, ValidationChain } from '../chain';
import { InternalRequest, Middleware, Request } from '../base';
import { ContextBuilder } from '../context-builder';
import { ContextItem } from '../context-items';
import { Result } from '../validation-result';

// A dummy context item that gets added to surrogate contexts just to make them run
const dummyItem: ContextItem = { async run() {} };

export type OneOfCustomMessageBuilder = (options: { req: Request }) => any;

export type OneOfErrorType = 'grouped' | 'leastErroredOnly' | 'flat';

// Not used in this file, just for third party users.
export type OneOfOptions =
  | {
      message?: OneOfCustomMessageBuilder;
      errorType?: OneOfErrorType;
    }
  | {
      message?: any;
      errorType?: OneOfErrorType;
    };

/**
 * Creates a middleware that will ensure that at least one of the given validation chains
 * or validation chain groups are valid.
 *
 * If none are, a single error for a pseudo-field `_error` is added to the request,
 * with the errors of each chain made available under the `nestedErrors` property.
 *
 * @param chains an array of validation chains to check if are valid.
 *               If any of the items of `chains` is an array of validation chains, then all of them
 *               must be valid together for the request to be considered valid.
 * @param options.message a function for creating a custom error message in case none of the chains are valid
 */
export function oneOf(
  chains: (ValidationChain | ValidationChain[])[],
  options?: { message?: OneOfCustomMessageBuilder; errorType?: OneOfErrorType },
): Middleware & { run: (req: Request) => Promise<Result> };

/**
 * Creates a middleware that will ensure that at least one of the given validation chains
 * or validation chain groups are valid.
 *
 * If none are, a single error for a pseudo-field `_error` is added to the request,
 * with the errors of each chain made available under the `nestedErrors` property.
 *
 * @param chains an array of validation chains to check if are valid.
 *               If any of the items of `chains` is an array of validation chains, then all of them
 *               must be valid together for the request to be considered valid.
 * @param options.message an error message to use in case none of the chains are valid
 */
export function oneOf(
  chains: (ValidationChain | ValidationChain[])[],
  options?: { message?: any; errorType?: OneOfErrorType },
): Middleware & { run: (req: Request) => Promise<Result> };

export function oneOf(
  chains: (ValidationChain | ValidationChain[])[],
  options: { message?: any; errorType?: OneOfErrorType } = {},
): Middleware & { run: (req: Request) => Promise<Result> } {
  let result: Result;
  const middleware = async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
    const surrogateContext = new ContextBuilder().addItem(dummyItem).build();

    // Run each group of chains in parallel, and within each group, run each chain in parallel too.
    const promises = chains.map(async chain => {
      const group = Array.isArray(chain) ? chain : [chain];
      const results = await Promise.all(group.map(chain => chain.run(req, { dryRun: true })));
      const contexts = results.map(result => result.context);
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

    try {
      const allErrors = await Promise.all(promises);
      const success = allErrors.some(groupErrors => groupErrors.length === 0);

      if (!success) {
        let error;
        switch (options.errorType) {
          case 'flat':
            error = _.flatMap(allErrors);
            break;
          case 'leastErroredOnly':
            let leastErroredIndex = 0;
            for (let i = 1; i < allErrors.length; i++) {
              if (allErrors[i].length < allErrors[leastErroredIndex].length) {
                leastErroredIndex = i;
              }
            }
            error = allErrors[leastErroredIndex];
            break;
          default:
            // grouped
            error = allErrors;
        }

        // Only add an error to the context if no group of chains had success.
        surrogateContext.addError({
          type: 'nested',
          req,
          message: options.message || 'Invalid value(s)',
          nestedErrors: error,
        });
      }

      // Final context running pass to ensure contexts are added and values are modified properly
      result = await new ContextRunnerImpl(surrogateContext).run(req);
      next();
    } catch (e) {
      next(e);
    }
  };

  const run = async (req: Request) => {
    return new Promise<Result>((resolve, reject) => {
      middleware(req, {}, (e?: any) => {
        e ? reject(e) : resolve(result);
      });
    });
  };

  return Object.assign(middleware, { run });
}
