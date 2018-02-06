const _ = require('lodash');
const runner = require('./runner');

module.exports = (validationChains, message) => (req, res, next) => {
  const run = chain => runner(req, getContext(chain));

  const contexts = _.flatMap(validationChains, chain => {
    return Array.isArray(chain) ? chain.map(getContext) : getContext(chain);
  });

  const promises = validationChains.map(chain => {
    if (!Array.isArray(chain)) {
      return run(chain);
    }

    return Promise.all(chain.map(run)).then(results => _.flatten(results, true));
  });

  return Promise.all(promises).then(results => {
    req._validationContexts = (req._validationContexts || []).concat(contexts);
    req._validationErrors = req._validationErrors || [];
    req._validationErrorsOneOf = _.flatten(results);

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

function getContext(chain) {
  return chain._context;
}

function getDynamicMessage(message, req) {
  if (typeof message !== 'function') {
    return message;
  }

  return message({ req });
}