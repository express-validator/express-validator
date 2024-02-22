import * as _ from 'lodash';
import {
  AlternativeMessageFactory,
  ErrorMessage,
  FieldValidationError,
  GroupedAlternativeMessageFactory,
  Middleware,
  Request,
} from '../base';
import { ContextRunner, ContextRunnerImpl, ValidationChain } from '../chain';
import { ReadonlyContext } from '../context';
import { ContextBuilder } from '../context-builder';
import { runAllChains } from '../utils';

export type OneOfErrorType = 'grouped' | 'least_errored' | 'flat';

export type OneOfOptions =
  | {
      /**
       * The error message to use in case none of the chains are valid.
       */
      message?: AlternativeMessageFactory | ErrorMessage;
      errorType?: Exclude<OneOfErrorType, 'grouped'>;
    }
  | {
      /**
       * The error message to use in case none of the chain groups are valid.
       */
      message?: GroupedAlternativeMessageFactory | ErrorMessage;
      errorType?: 'grouped';
    };

/**
 * Creates a middleware that will ensure that at least one of the given validation chains
 * or validation chain groups are valid.
 *
 * If none are, a single `AlternativeValidationError` or `GroupedAlternativeValidationError`
 * is added to the request, with the errors of each chain made available under the `nestedErrors` property.
 *
 * @param chains an array of validation chains to check if are valid.
 *               If any of the items of `chains` is an array of validation chains, then all of them
 *               must be valid together for the request to be considered valid.
 */
export function oneOf(
  chains: (ValidationChain | ValidationChain[])[],
  options: OneOfOptions = {},
): Middleware & ContextRunner {
  const run = async (req: Request, opts?: { dryRun?: boolean }) => {
    const surrogateContextBuilder = new ContextBuilder();

    // Run each group of chains in parallel
    const promises = chains.map(async chain => {
      const group = Array.isArray(chain) ? chain : [chain];
      const results = await runAllChains(req, group, { dryRun: true });
      const { contexts, groupErrors } = results.reduce(
        ({ contexts, groupErrors }, result) => {
          const { context } = result;
          contexts.push(context);

          const fieldErrors = context.errors.filter(
            (error): error is FieldValidationError => error.type === 'field',
          );
          groupErrors.push(...fieldErrors);

          return { contexts, groupErrors };
        },
        {
          contexts: [] as ReadonlyContext[],
          groupErrors: [] as FieldValidationError[],
        },
      );

      // #536: The data from a chain within oneOf() can only be made available to e.g. matchedData()
      // if its entire group is valid.
      if (!groupErrors.length) {
        surrogateContextBuilder.pushSubcontext(...contexts);
      }

      return groupErrors;
    });

    const allErrors = await Promise.all(promises);

    const surrogateContext = surrogateContextBuilder.build();
    // fieldInstances are used in matchedData
    for (const context of surrogateContext.subcontexts) {
      surrogateContext.addFieldInstances(context.getData());
    }

    const successfulChain = allErrors.find(groupErrors => groupErrors.length === 0);
    const success = successfulChain !== undefined;

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
        case 'least_errored':
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
