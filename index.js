const authEndpoint = require('./src/api/auth')
const { createJWT, verifyJWT, authenticate } = require('./src/helpers')

const {
  createServiceClientFromEnvironment,
} = require('./src/scripts/createServiceClientFromEnvironment')

module.exports = {
  server: () => app => authEndpoint(app),
  createJWT,
  verifyJWT,
  authenticate,
  createServiceClientFromEnvironment,
}
