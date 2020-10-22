const { model } = require('./client')
const client = require('./client')

module.exports = {
  client,
  models: {
    Client: model,
  },
}
