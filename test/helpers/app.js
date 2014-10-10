// Sample app
var express = require('express');
var expressValidator = require('../../index');

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
  self.app.use(expressValidator({
    customValidators: {
      isArray: function(value) {
        return Array.isArray(value);
      }
    }
  }));

  self.app.get(/\/test(\d+)/, self.validation);
  self.app.get('/:testparam?', self.validation);
  self.app.post('/:testparam?', self.validation);

  self.app.listen(this.port);
};

App.prototype.stop = function() {
  this.app.close();
};
