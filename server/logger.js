const winston = require('winston');

const DEFAULT_LOG_LEVEL = 'info';

winston.configure({
  level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      humanReadableUnhandledException: true,
      colorize: true,
      timestamp: true
    })
  ]
});

module.exports = winston;
