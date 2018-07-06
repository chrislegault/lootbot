const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, simple } = format;

const logger = createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: combine(colorize(), timestamp(), simple()),
  transports: [
    new transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: true
});

module.exports = logger;
