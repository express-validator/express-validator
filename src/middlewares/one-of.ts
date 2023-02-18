import * as _ from 'lodash';
import { AlternativeMessageFactory, FieldValidationError, Middleware, Request } from '../base';
import { ContextRunner, ContextRunnerImpl, ValidationChain } from '../chain';
import { ReadonlyContext } from '../context';
import { ContextBuilder } from '../context-builder';
import { ContextItem } from '../context-items';

// A dummy context item that gets added to surrogate contexts just to make them run
const dummyItem: ContextItem = { async run() {} };

export type OneOfErrorType = 'grouped' | 'leastErroredOnly' | 'flat';

// Not used in this file, just for third party users.
export type OneOfOptions =
  | {
      message?: AlternativeMessageFactory;
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
  options?: { message?: AlternativeMessageFactory; errorType?: OneOfErrorType },
): Middleware & ContextRunner;

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
): Middleware & ContextRunner;

export function oneOf(
  chains: (ValidationChain | ValidationChain[])[],
  options: { message?: any; errorType?: OneOfErrorType } = {},
): Middleware & ContextRunner {
  const run = async (req: Request, opts?: { dryRun?: boolean }) => {
    const surrogateContext = new ContextBuilder().addItem(dummyItem).build();

    // Run each group of chains in parallel
    const promises = chains.map(async chain => {
      const group = Array.isArray(chain) ? chain : [chain];
      const contexts: ReadonlyContext[] = [];
      const groupErrors: FieldValidationError[] = [];
      for (const chain of group) {
        const result = await chain.run(req, { dryRun: true });
        const { context } = result;
        contexts.push(context);

        const fieldErrors = context.errors.filter(
          (error): error is FieldValidationError => error.type === 'field',
        );
        groupErrors.push(...fieldErrors);

        if (context.bail && !result.isEmpty()) {
          break;
        }
      }

      // #536: The data from a chain within oneOf() can only be made available to e.g. matchedData()
      // if its entire group is valid.
      if (!groupErrors.length) {
        contexts.forEach(context => {
          surrogateContext.addFieldInstances(context.getData());
        });
      }

      return groupErrors;
    });

    const allErrors = await Promise.all(promises);
    const success = allErrors.some(groupErrors => groupErrors.length === 0);

    if (!success) {
      const message = options.message || 'Invalid value(s)';
      switch (options.errorType) {
        case 'flat':
          surrogateContext.addError({
            type: 'alternative',
            req,
            message,
            nestedErrors: _.flatMap(allErrors),
          });
          break;
        case 'leastErroredOnly':
          let leastErroredIndex = 0;
          for (let i = 1; i < allErrors.length; i++) {
            if (allErrors[i].length < allErrors[leastErroredIndex].length) {
              leastErroredIndex = i;
            }
          }
          surrogateContext.addError({
            type: 'alternative',
            req,
            message,
            nestedErrors: allErrors[leastErroredIndex],
          });
          break;

        case 'grouped':
        default:
          // grouped
          surrogateContext.addError({
            type: 'alternative_grouped',
            req,
            message,
            nestedErrors: allErrors,
          });
          break;
      }
    }

    // Final context running pass to ensure contexts are added and values are modified properly
    return await new ContextRunnerImpl(surrogateContext).run(req, opts);
  };

  const middleware: Middleware = (req, _res, next) => run(req).then(() => next(), next);
  return Object.assign(middleware, { run });
}
