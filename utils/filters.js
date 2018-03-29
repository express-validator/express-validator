const { extraSanitizers, extraValidators } = require('./constants');

exports.isSanitizer = name => name.startsWith('to') || extraSanitizers.includes(name);
exports.isValidator = name => name.startsWith('is') || extraValidators.includes(name);