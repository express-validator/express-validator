// Sample app
var express = require('express');
var expressValidator = require('../../index');
var bodyParser = require('body-parser');
var http = require('http');

var port = process.env.PORT || 8888;
var app = express();

module.exports = function(validation) {

  app.set('port', port);
  app.use(bodyParser.json());
  app.use(expressValidator({
    customValidators: {
      isArray: function(value) {
        return Array.isArray(value);
      }
    }
  }));

  app.get(/\/test(\d+)/, validation);
  app.get('/:testparam?', validation);
  app.post('/:testparam?', validation);

  /**
   * Create HTTP server.
   */
  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  return app;
};

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
