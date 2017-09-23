module.exports = function toString(value) {
  if (value && typeof value === 'object' && value.toString) {
    return value.toString();
  } else if (value == null || (isNaN(value) && !value.length)) {
    return '';
  }

  return String(value);
};