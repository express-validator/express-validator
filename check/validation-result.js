module.exports = req => decorateAsValidationResult({}, req._validationErrors);

function decorateAsValidationResult(obj, errors = []) {
  let formatter = error => error;

  obj.isEmpty = () => !errors.length;
  obj.array = ({ onlyFirstError } = {}) => {
    const used = {};
    let filteredErrors = !onlyFirstError ? errors : errors.filter(error => {
      if (used[error.param]) {
        return false;
      }

      used[error.param] = true;
      return true;
    });

    return filteredErrors.map(formatter);
  };

  obj.mapped = () => errors.reduce((mapping, error) => {
    if (!mapping[error.param]) {
      mapping[error.param] = formatter(error);
    }

    return mapping;
  }, {});

  obj.formatWith = errorFormatter => {
    formatter = errorFormatter;
    return obj;
  };

  obj.throw = () => {
    if (errors.length) {
      throw decorateAsValidationResult(new Error('Validation failed'), errors).formatWith(formatter);
    }
  };

  return obj;
}