const sheetsApi = require('googleapis').sheets('v4')
const logger = require('../logger')
const { sheetsOrder } = require('../internal-format')
const buildClient = require('./build-client')

const quiet = (config, transactions) => {
  return new Promise((resolve, reject) => {
    resolve(transactions[transactions.length - 1][0])
  })
}

const logWriter = (config, transactions) => {
  return new Promise((resolve, reject) => {
    transactions.map(t => logger.info(t.join(', ')))

    resolve(transactions[transactions.length - 1][0])
  })
}

const sheetsWriter = ({ config, transaction }) => {
  return new Promise((resolve, reject) => {
    const row = sheetsOrder(transaction)

    sheetsApi.spreadsheets.values.append({
      auth: buildClient(config.sheets),
      spreadsheetId: config.sheets.id,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      includeValuesInResponse: true,
      resource: { values: [row] }
    }, (err, response) => {
      if (err) reject(err)

      resolve(response)
    })
  })
}

const writers = { 'log': logWriter, 'sheets': sheetsWriter, 'quiet': quiet }

module.exports = ({ config, transaction }) => {
  return writers[config.writer || 'sheets']({ config, transaction })
}
