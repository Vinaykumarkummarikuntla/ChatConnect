const winston = require('winston')

// Configure the logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }) // Log to a file
  ]
})

// Export the logger instance
module.exports = logger
