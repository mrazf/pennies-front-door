const GoogleAuth = require('google-auth-library')

module.exports = (config) => {
  const auth = new GoogleAuth()
  const oauth2Client = new auth.OAuth2(config.clientId, config.clientSecret, config.redirectUris[0])

  oauth2Client.credentials = config.apiToken

  return oauth2Client
}
