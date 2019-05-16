import * as _ from 'lodash';
import { ValidationChain } from '../chain';
import { InternalRequest, Request, ValidationError, errorsSymbol, failedOneOfContextsSymbol, middlewareModeSymbol } from '../base';

export function oneOf(chains: (ValidationChain | ValidationChain[])[], message?: any) {
  return async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
    const run = (chain: ValidationChain) => new Promise<ValidationError[]>(resolve => {
      chain(Object.assign(req, { [middlewareModeSymbol]: true }), _res, errors => {
        resolve(errors || []);
      });
    });

    // The shape should be [[group 1's errors], [group 2's errors], [...etc]]
    const allErrors = await Promise.all(chains.map(async chain => {
      const group = Array.isArray(chain) ? chain : [chain];
      return Promise.all(group.map(run)).then(errors => _.flatten(errors));
    }));

    const failedContexts = _(allErrors)
      // If a group is free of errors, the empty array plays the trick of filtering such group.
      .flatMap((errors, index) => errors.length > 0 ? chains[index] : [])
      .map(chain => chain.context)
      .valueOf();

    // #536: If a field within oneOf() is valid, but its group of chains isn't,
    // then it shouldn't be picked up by matchedData().
    req[failedOneOfContextsSymbol] = (req[failedOneOfContextsSymbol] || []).concat(failedContexts);

    // Did any of the groups of chains succeed?
    const allInvalids = allErrors.every(results => results.length > 0);
    if (allInvalids) {
      req[errorsSymbol] = (req[errorsSymbol] || []).concat({
        param: '_error',
        msg: getDynamicMessage(message || 'Invalid value(s)', req),
        nestedErrors: _.flattenDeep(allErrors) as ValidationError[],
      });
    }

    next();
  };
}

function getDynamicMessage(message: any, req: Request) {
  return typeof message === 'function' ? message({ req }) : message;
}