const _ = require('lodash');

module.exports = (req, fieldInstances) => {
  fieldInstances.filter(instance => {
    const initialValue = _.get(req[instance.location], instance.path);
    return initialValue !== instance.value;
  }).forEach(instance => {
    _.set(req[instance.location], instance.path, instance.value);
  });
};