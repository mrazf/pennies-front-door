const googleapis = require('googleapis')
const buildClient = require('./buildClient')
const logger = require('../logger')

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

const sheetsWriter = (sheetsId, transactions) => {
  return new Promise((resolve, reject) => {
    googleapis.sheets('v4').spreadsheets.values.append({
      auth: buildClient(),
      spreadsheetId: sheetsId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      includeValuesInResponse: true,
      resource: { values: transactions }
    }, (err, response) => {
      if (err) reject(err)

      resolve(transactions[transactions.length - 1][0])
    })
  })
}

const writers = { 'log': logWriter, 'sheets': sheetsWriter, 'quiet': quiet }

module.exports = ({ sheetsId, sheetsWriter = 'log' }, transactions) => {
  return writers[sheetsWriter](sheetsId, transactions)
}
