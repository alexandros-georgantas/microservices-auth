const authEndpoint = require('./src/api/auth')
const { createJWT, verifyJWT, authenticate } = require('./src/helpers')

module.exports = {
  server: () => app => authEndpoint(app),
  createJWT,
  verifyJWT,
  authenticate,
}
