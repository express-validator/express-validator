// Sample app
var express = require('express');
var expressValidator = require('../../index');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8888;
var app = express();

// If no native implementation of Promise exists (less than Node v4),
// use Bluebird promises so we can test for both depending on the Node version
if (typeof Promise === 'undefined') {
  Promise = require('bluebird');
}

module.exports = function(validation) {

  app.set('port', port);
  app.use(bodyParser.json());
  app.use(expressValidator({
    customValidators: {
      isArray: function(value) {
        return Array.isArray(value);
      },
      isAsyncTest: function(testparam) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            if (testparam === '42') { return resolve(); }
            reject();
          }, 200);
        });
      }
    },
    customSanitizers: {
      toTestSanitize: function() {
        return "!!!!";
      }
    }
  }));

  app.get(/\/test(\d+)/, validation);
  app.get('/:testparam?', validation);
  app.post('/:testparam?', validation);

  return app;
};
