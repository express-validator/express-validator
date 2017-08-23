module.exports = req => decorateAsValidationResult({}, req._validationErrors);

function decorateAsValidationResult(obj, errors) {
  obj.isEmpty = () => !errors.length;
  obj.array = ({ onlyFirstError } = {}) => {
    const used = {};
    return !onlyFirstError ? errors : errors.filter(error => {
      if (used[error.param]) {
        return false;
      }

      used[error.param] = true;
      return true;
    });
  };

  obj.mapped = () => errors.reduce((mapping, error) => {
    if (!mapping[error.param]) {
      mapping[error.param] = error;
    }

    return mapping;
  }, {});

  obj.throw = () => {
    if (errors.length) {
      throw decorateAsValidationResult(new Error('Validation failed'), errors);
    }
  };

  return obj;
}