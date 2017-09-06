module.exports = function replaceArgs(msg, args) {
  if (typeof msg !== 'string') {
    return msg;
  }

  return args.reduce((msg, arg, index) => msg.replace('%' + index, arg), msg);
};