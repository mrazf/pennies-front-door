const sheets = require('./sheets')
const logger = require('./logger')
const configurator = require('./configurator')
const { formatter } = require('./internal-format')

const headers = { 'Content-type': 'application/json' }

const parseBody = ({ body }) => {
  if (!body) {
    logger.warn('Handler: No body in payload')

    return { error: 'No body in payload' }
  }

  let parsed
  try {
    parsed = typeof body === 'object' ? body : JSON.parse(body)
  } catch (err) {
    logger.warn(`Handler: Unparsable body ${body} with ${err}`)
    console.log('were here')
    return { error: 'Unparsable body' }
  }

  if (!parsed.data) {
    logger.warn('Handler: no data')

    return { error: 'No data attribute' }
  }

  return parsed.data
}

exports.handler = (event, context, callback) => {
  if (event.httpMethod === 'POST') {
    const data = parseBody(event)
    console.log({ headers, statusCode: 400, body: data.error })
    if (data.error) return callback(JSON.stringify({ headers, statusCode: 400, body: data.error }))
    if (!data.include_in_spending) return callback(null, { headers, statusCode: 200, body: { requiredProcessing: false } })

    const transaction = formatter(data)

    configurator()
      .then(config => sheets({ config, transaction }))
      .then(response => {
        callback(null, { headers, statusCode: 200, body: { description: '' } })
      })
      .catch(error => {
        logger.error(`Handler: ${error}`)

        callback({ headers, statusCode: 500, body: error })
      })
  }
}
