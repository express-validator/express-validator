const validator = require('validator');

module.exports = function formatParamOutput(param) {
  if (Array.isArray(param)) {
    param = param.reduce((prev, curr) => {
      var part = '';
      if (validator.isInt(curr)) {
        part = '[' + curr + ']';
      } else if (prev) {
        part = '.' + curr;
      } else {
        part = curr;
      }

      return prev + part;
    }, '');
  }

  return param;
};

module.exports(['foo']);