const _ = require('lodash');
const runner = require('./runner');

module.exports = (validationChains, message) => (req, res, next) => {
  const run = chain => runner(req, getContext(chain));

  const contexts = _.flatMap(validationChains, chain => {
    return Array.isArray(chain) ? chain.map(getContext) : getContext(chain);
  });

  // These promises resolve to an array with results with the chain that
  // generated the results
  const promises = validationChains.map(chain => {
    if (!Array.isArray(chain)) {
      return run(chain).then(results => [results, chain]);
    }

    return Promise.all(chain.map(run)).then(results => [_.flatten(results, true), chain]);
  });

  return Promise.all(promises).then(resultsAndChains => {
    const [results, successFields] = extractResultsAndSuccessFields(resultsAndChains);

    req._validationContexts = (req._validationContexts || []).concat(contexts);
    req._validationErrors = req._validationErrors || [];
    req._validationErrorsOneOf = _.flatten(results)
      // Remove error results that matches fields in the successful chain
      .filter(result => !successFields.includes(result.param));

    const empty = results.some(result => result.length === 0);
    if (!empty) {
      req._validationErrors.push({
        param: '_error',
        msg: getDynamicMessage(message || 'Invalid value(s)', req),
        nestedErrors: _.flatten(results, true)
      });
    }

    next();
    return results;
  }).catch(next);
};

function extractResultsAndSuccessFields(resultsAndChains) {
  const results = resultsAndChains.map(([r]) => r);
  const successIndex = results.findIndex(res => res.length === 0);
  const successChain = successIndex >= 0 ? resultsAndChains[successIndex][1] : [];
  const successFields = (Array.isArray(successChain)
    ? _.flatten(successChain.map(getContext).map(c => c.fields))
    : getContext(successChain).fields);
  return [results, successFields];
}

function getContext(chain) {
  return chain._context;
}

function getDynamicMessage(message, req) {
  if (typeof message !== 'function') {
    return message;
  }

  return message({ req });
}