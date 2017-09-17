const sanitize = require('./sanitize');
module.exports = fields => sanitize(fields, ['body', 'cookies', 'params', 'query']);