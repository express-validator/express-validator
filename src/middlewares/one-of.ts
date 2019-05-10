import * as _ from 'lodash';
import { ValidationChain } from '../chain';
import { Request, middlewareModeSymbol, errorsSymbol, InternalRequest, ValidationError } from '../base';

export function oneOf(chains: (ValidationChain | ValidationChain[])[], message?: any) {
  return async (req: InternalRequest, _res: any, next: (err?: any) => void) => {
    const run = (chain: ValidationChain) => new Promise<ValidationError[]>(resolve => {
      chain(Object.assign(req, { [middlewareModeSymbol]: true }), _res, errors => {
        resolve(errors || []);
      });
    });

    const allErrors = await Promise.all(chains.map(async chain => {
      const group = Array.isArray(chain) ? chain : [chain];
      return Promise.all(group.map(run)).then(errors => _.flatten(errors));
    }));

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