const REQ_KEY = '_validationCustomMethods';

module.exports = (req, options) => {
  req[REQ_KEY] = req[REQ_KEY] || {
    sanitizers: {},
    validators: {}
  };

  Object.assign(req[REQ_KEY].validators, options.customValidators);
  Object.assign(req[REQ_KEY].sanitizers, options.customSanitizers);

  return req[REQ_KEY];
};