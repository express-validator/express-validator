var _ = require('lodash');
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

exports.mapAndExtend = function createCustomValidators(src, dest, mapFunction) {
  Object.keys(src).forEach(function (name) {
    dest[name] = mapFunction(name, src);
  });
};

exports.replaceArgs = function replaceArgs(msg, args) {
  if (typeof msg !== 'string') {
    return msg;
  }

  return args.reduce((msg, arg, index) => msg.replace('%' + index, arg), msg);
};

/**
 * Sanitizes and sets sanitized value on the request, then return instance of itself to allow for chaining
 *
 * @method makeSanitizer
 * @param  {string}          methodName
 * @param  {object}          container
 * @return {function}
 */
exports.makeSanitizer = function makeSanitizer(methodName, container) {
  return function() {
    var _arguments = arguments;
    var result;
    this.values.forEach(function(value, i) {
      if (value != null) {
        var args = [value];
        args = args.concat(Array.prototype.slice.call(_arguments));
        result = container[methodName].apply(container, args);

        _.set(this.req[this.locations[i]], this.param, result);
        this.values[i] = result;
      }
    }.bind(this));

    return result;
  };
}