module.exports = value => {
  if (Array.isArray(value) && value.length) {
    return toString(value[0]);
  }

  return toString(value);
};

function toString(value) {
  if (value && typeof value === 'object' && value.toString) {
    return value.toString();
  } else if (value == null || (isNaN(value) && !value.length)) {
    return '';
  }

  return String(value);
};