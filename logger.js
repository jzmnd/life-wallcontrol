// Requires
var path = require('path');
var winston = require('winston');
var expressWinston = require('express-winston');

// Logger
module.exports = winstonLog = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true,
      json: false
    }),
    new winston.transports.File({
      filename: [ROOTPATH, 'serverlog.log'].join(path.sep),
      json: true,
      maxsize: 5242880
    })
  ],
  exitOnError: false,
  handleExceptions: true
});

// Logging middleware for Express
module.exports.logExpress = new expressWinston.logger({
    winstonInstance: winstonLog,
    meta: false,
    expressFormat: true,
    colorize: true,
    handleExceptions: true
  });
