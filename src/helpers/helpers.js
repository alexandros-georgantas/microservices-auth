const jwt = require('jsonwebtoken')
const config = require('config')

const { models } = require('../models')

const { ServiceClient } = models

const createJWT = data => {
  let expiresIn = 28800000 // 8hours
  if (config.has('pubsweet-server.tokenExpiresIn')) {
    expiresIn = config.get('pubsweet-server.tokenExpiresIn')
  }
  if (!config.get('pubsweet-server.secret')) {
    throw new Error('pubsweet-server secret is required')
  }
  return jwt.sign(
    {
      data,
    },
    config.get('pubsweet-server.secret'),
    { expiresIn },
  )
}

const verifyJWT = token => {
  try {
    if (!config.get('pubsweet-server.secret')) {
      throw new Error('pubsweet-server secret is required')
    }
    return jwt.verify(token, config.get('pubsweet-server.secret'))
  } catch (err) {
    throw new Error(err)
  }
}

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = verifyJWT(token)
    const { data } = decodedToken
    const { clientId } = data
    const client = await ServiceClient.query().findById(clientId)

    if (!client) {
      throw new Error('client does not exist')
    }

    return next()
  } catch (e) {
    const msg =
      e.message === 'TokenExpiredError: jwt expired'
        ? 'expired token'
        : 'invalid request'
    return res.status(401).json({
      msg,
    })
  }
}

module.exports = { createJWT, verifyJWT, authenticate }
