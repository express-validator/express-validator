var request = require('request');

function check(assertion, cb) {
  return function(err, res, body) {
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return cb(e);
      }
    }
    assertion(body);
    cb(null);
  };
}

function req() {
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();
  var assertion = args.pop();
  var method = args.shift();
  args.push(check(assertion, cb));
  request[method].apply(this, args);
}
module.exports = req;
