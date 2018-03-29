const _ = require('lodash');

exports.toString = require('../utils/to-string');
exports.formatParamOutput = require('../utils/format-param-output');

exports.mapAndExtend = function mapAndExtend(src, dest, mapFunction) {
  Object.keys(src).forEach(function (name) {
    dest[name] = mapFunction(name, src);
  });
};

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
};

exports.replaceArgs = function replaceArgs(msg, args) {
  if (typeof msg !== 'string') {
    return msg;
  }

  return args.reduce((msg, arg, index) => msg.replace('%' + index, arg), msg);
};