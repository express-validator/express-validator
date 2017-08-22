const check = require('./check');
module.exports = (fields, message) => check(fields, ['headers'], message);