const _ = require('lodash');
const persistValues = require('../utils/persist-values');
const runner = require('./runner');

module.exports = (validationChains, message) => (req, res, next) => {
  const run = chain => runner(req, getContext(chain));

  const contexts = _.flatMap(validationChains, chain => {
    return Array.isArray(chain) ? chain.map(getContext) : getContext(chain);
  });

  const promises = validationChains.map(chain => {
    const group = Array.isArray(chain) ? chain : [chain];
    return Promise.all(group.map(run)).then(results => _.flatten(results));
  });

  return Promise.all(promises).then(results => {
    req._validationContexts = (req._validationContexts || []).concat(contexts);
    req._validationErrors = req._validationErrors || [];

    const failedGroupContexts = findFailedGroupContexts(results, validationChains);
    req._validationOneOfFailures = (req._validationOneOfFailures || []).concat(failedGroupContexts);

    const empty = results.some(result => result.length === 0);
    if (!empty) {
      req._validationErrors.push({
        param: '_error',
        msg: getDynamicMessage(message || 'Invalid value(s)', req),
        nestedErrors: _.flatten(results, true)
      });
    }

    contexts.forEach(context => persistValues(req, context));
    next();
    return results;
  }).catch(next);
};

function getContext(chain) {
  return chain._context;
}

function findFailedGroupContexts(results, validationChains) {
  return _(results)
    // If the group is free of errors, the empty array plays the trick of filtering such group.
    .flatMap((result, index) => result.length > 0 ? validationChains[index] : [])
    .map(getContext)
    .value();
}

function getDynamicMessage(message, req) {
  if (typeof message !== 'function') {
    return message;
  }

  return message({ req });
}