var validator = require('validator');

module.exports = exports = {};

// Convert nested params as array into string for output
// Ex: ['users', '0', 'fields', 'email'] to 'users[0].fields.email'
exports.formatParamOutput = function formatParamOutput(param) {
  if (Array.isArray(param)) {
    param = param.reduce(function(prev, curr) {
      var part = '';
      if (validator.isInt(curr)) {
        part = '[' + curr + ']';
      } else {
        if (prev) {
          part = '.' + curr;
        } else {
          part = curr;
        }
      }

      return prev + part;
    });
  }

  return param;
};

exports.decorateAsValidationResult = function decorateAsValidationResult(obj, errors) {
  var onlyFirstError = false;

  obj.isEmpty = function isEmpty() {
    return !errors.length;
  };

  obj.array = function allErrors() {
    var used = {};
    return !onlyFirstError ? errors : errors.filter(function(error) {
      if (used[error.param]) {
        return false;
      }

      used[error.param] = true;
      return true;
    });
  };

  obj.mapped = function mappedErrors() {
    return errors.reduce(function(mapping, error) {
      if (!onlyFirstError || !mapping[error.param]) {
        mapping[error.param] = error;
      }

      return mapping;
    }, {});
  };

  obj.useFirstErrorOnly = function useFirstErrorOnly(flag) {
    onlyFirstError = flag === undefined || flag;
    return obj;
  };

  obj.throw = function throwError() {
    if (errors.length) {
      throw decorateAsValidationResult(new Error('Validation failed'), errors);
    }
  };

  return obj;
};