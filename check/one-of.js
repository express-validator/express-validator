const runner = require('./runner');

module.exports = validationChains => (req, res, next) => {
  const contexts = validationChains.map(chain => chain._context);
  const promises = contexts.map(context => runner(req, context));

  return Promise.all(promises).then(results => {
    req._validationContexts = (req._validationContexts || []).concat(contexts);

    const empty = results.some(result => result.length === 0);
    if (empty) {
      next();
      return [];
    }

    req._validationErrors = (req._validationErrors || []).concat(results[0]);
    next();

    return results[0];
  }).catch(next);
};