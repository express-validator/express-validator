const check = require('../check/check');

module.exports = (field, location, message, contexts, { validators, sanitizers }) => {
  const chain = check([field], Array.isArray(location) ? location : [location], message);
  contexts.push(chain._context);

  chain.notEmpty = () => chain.isLength({ min: 1 });
  chain.len = chain.isLength;

  Object.keys(validators).forEach(name => {
    chain[name] = (...options) => {
      chain._context.validators.push({
        options,
        custom: true,
        negated: chain._context.negateNext,
        validator: validators[name]
      });
      chain._context.negateNext = false;
      return chain;
    };
  });

  Object.keys(sanitizers).forEach(name => {
    chain[name] = (...options) => {
      chain._context.sanitizers.push({
        options,
        sanitizer: sanitizers[name]
      });
      return chain;
    };
  });

  return chain;
};