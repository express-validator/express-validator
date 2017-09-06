const _ = require('lodash');

module.exports = function makeSanitizer(methodName, container) {
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