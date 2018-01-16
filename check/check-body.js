const check = require('./check');
module.exports = (fields, message, opts) => check(fields, ['body'], message, opts);