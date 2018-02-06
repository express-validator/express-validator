const _ = require('lodash');
const selectFields = require('./select-fields');

module.exports = (req, context) => {
  selectFields(req, context).forEach(instance => {
    _.set(req[instance.location], instance.path, instance.value);
  });
};