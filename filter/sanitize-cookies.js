const sanitize = require('./sanitize');
module.exports = fields => sanitize(fields, ['cookies']);