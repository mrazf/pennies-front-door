const winston = require('winston')
const moment = require('moment')

module.exports = new winston.Logger({
  handleExceptions: true,
  colorize: true,
  transports: [
    new (winston.transports.Console)({
      timestamp: () => moment().format('YYYY-M-D HH:mm:s - '),
      formatter: options => {
        return options.timestamp() + options.level.toUpperCase() + ' ' + (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '')
      }
    })
  ]
})
