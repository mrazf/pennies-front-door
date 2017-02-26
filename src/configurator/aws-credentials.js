const aws = require('aws-sdk')

module.exports = () => {
  process.env['AWS_LAMBDA_FUNCTION_NAME'] ? null : new aws.SharedIniFileCredentials({ profile: 'default' })
}
