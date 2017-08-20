const check = require('./check');
module.exports = fields => check(fields, ['body', 'query', 'cookies', 'headers', 'params']);