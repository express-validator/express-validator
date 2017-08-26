const runner = require('./runner');

module.exports = validationChains => (req, res, next) => {
  const promises = validationChains.map(chain => runner(req, chain._context));
  return Promise.all(promises).then(results => {
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