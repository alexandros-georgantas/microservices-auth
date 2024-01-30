const { logger } = require('@coko/server')
const { models } = require('../../models')
const { createJWT } = require('../../helpers')

const { ServiceClient } = models

const authHandler = async (req, res) => {
  try {
    logger.info(`checking request's headers`)
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        msg: 'Missing the appropriate headers',
      })
    }

    const basic = authHeader.split(' ')

    if (basic.length !== 2) {
      return res.status(401).json({
        msg: 'Malformed headers',
      })
    }

    const basicToken = basic[1]

    if (basic[0] !== 'Basic' || !basicToken) {
      return res.status(401).json({
        msg: 'Wrong type of auth header or invalid token',
      })
    }

    logger.info(`basic token found`)
    logger.info(`decoding token`)

    const decodedToken = Buffer.from(basicToken, 'base64').toString()
    const deconstructedToken = decodedToken.split(':')

    if (deconstructedToken.length !== 2) {
      return res.status(401).json({
        msg: 'Malformed token',
      })
    }

    logger.info(`checking for client`)
    const clientId = deconstructedToken[0]
    const clientSecret = deconstructedToken[1]
    const client = await ServiceClient.query().findById(clientId)

    const isClientValid = client
      ? await client.validClientSecret(clientSecret)
      : undefined

    if (!client || !isClientValid) {
      return res.status(403).json({
        msg: 'The system is not aware of this client',
      })
    }

    logger.info(`client is valid`)

    logger.info(`generating access token`)
    return res.status(200).json({
      accessToken: createJWT({ clientId }),
    })
  } catch (e) {
    throw new Error(e)
  }
}

const AuthBackend = app => {
  app.post('/api/auth', authHandler)
}

module.exports = AuthBackend
