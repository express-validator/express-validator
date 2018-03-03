const _ = require('lodash');
const selectFields = require('./select-fields');

module.exports = (req, context) => {
  selectFields(req, context).filter(instance => {
    const initialValue = _.get(req[instance.location], instance.path);
    return initialValue !== instance.value;
  }).forEach(instance => {
    _.set(req[instance.location], instance.path, instance.value);
  });
};