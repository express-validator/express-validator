const check = require('./check');
module.exports = (fields, message) => check(fields, ['params'], message);