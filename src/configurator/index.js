const AWS = require('aws-sdk')
const logger = require('../logger')
const awsCreds = require('./aws-credentials')

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1',
  endpoint: 'https://dynamodb.eu-west-1.amazonaws.com',
  credentials: awsCreds(),
  logger: { log: logger.info }
})

const envVarOrDie = (name) => {
  if (!process.env[name]) {
    logger.error(`Configurator: no env var ${name}`)

    throw Error('Missing env var in the configurator')
  }

  return process.env[name]
}

const sheets = () => {
  const params = { TableName: 'Pennies-SheetsApiToken', Key: { 'user': 'me' } }
  const envVars = {
    id: envVarOrDie('PENNIES_SHEETS_ID'),
    clientId: envVarOrDie('PENNIES_SHEETS_CLIENT_ID'),
    clientSecret: envVarOrDie('PENNIES_SHEETS_CLIENT_SECRET'),
    redirectUris: envVarOrDie('PENNIES_SHEETS_REDIRECTS').split(',')
  }

  return new Promise(function (resolve, reject) {
    dynamo.get(params, function (err, data) {
      if (err) reject(err)

      logger.info('Config: got ' + data + ' for sheets api token');

      resolve({ sheets: { apiToken: data.Item, ...envVars } })
    })
  })
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    sheets()
      .then(sheets => {
        resolve({
          email: {
            address: envVarOrDie('PENNIES_EMAIL_ADDRESS'),
            password: envVarOrDie('PENNIES_EMAIL_PASSWORD')
          },
          ...sheets
        })
      })
      .catch(err => {
        logger.error(err)
        reject(err)
      })
  })
}
