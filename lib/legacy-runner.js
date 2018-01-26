const _ = require('lodash');
const selectFields = require('../utils/select-fields');
const utils = require('./utils');

module.exports = function(contexts, req) {
  _(contexts)
    .filter(context => !context.ran)
    .flatMap(context => {
      return _(selectFields(req, context))
        .map(field => ({ field, context }))
        .groupBy(pair => pair.field.path)
        .map(pairs => pairs[0])
        .value();
    })
    .forEach(pairs => {
      const { field, context } = pairs;

      context.validators.map(validatorCfg => {
        const result = validatorCfg.validator(
          validatorCfg.custom ? field.value : utils.toString(field.value),
          ...validatorCfg.options
        );

        const errorObj = {
          location: field.location,
          value: field.value,
          param: utils.formatParamOutput(field.path),
          msg: utils.replaceArgs(
            validatorCfg.message || context.message || 'Invalid value',
            [field.value, ...validatorCfg.options]
          )
        };

        if (result && result.then) {
          req._asyncValidationErrors.push(result.then(() => {
            validatorCfg.negated && req._validationErrors.push(errorObj);
          }, () => {
            !validatorCfg.negated && req._validationErrors.push(errorObj);
          }));
        } else if ((!validatorCfg.negated && !result) || (validatorCfg.negated && result)) {
          req._validationErrors.push(errorObj);
        }
      });

      context.ran = true;
    });
};