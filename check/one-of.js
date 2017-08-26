const _ = require('lodash');
const runner = require('./runner');

module.exports = (validationChains, message) => (req, res, next) => {
  const contexts = validationChains.map(chain => chain._context);
  const promises = contexts.map(context => runner(req, context));

  return Promise.all(promises).then(results => {
    req._validationContexts = (req._validationContexts || []).concat(contexts);
    req._validationErrors = req._validationErrors || [];

    const empty = results.some(result => result.length === 0);
    if (!empty) {
      req._validationErrors.push({
        param: '_error',
        msg: message || 'Invalid value(s)',
        nestedErrors: _.flatten(results, true)
      });
    }

    next();
    return results;
  }).catch(next);
};