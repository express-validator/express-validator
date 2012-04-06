// Sample app
var express = require('express');
var expressValidator = require('../../index');

var app = null;

function App(port, validation) {
  this.app = null;
  this.port = port;
  this.validation = validation;
}
module.exports = App;

App.prototype.start = function() {
  var self = this;
  self.app = express.createServer();

  self.app.use(express.bodyParser());
  self.app.use(expressValidator);

  function testAction(req, res) {
    var errors = [];
    req.onValidationError(function(msg) {
      errors.push(msg);
      return this;
    });

    self.validation(req, res, errors);
  }
  self.app.get('/:testparam?', testAction);
  self.app.post('/:testparam?', testAction);

  self.app.listen(this.port);
};

App.prototype.stop = function() {
  this.app.close();
};
