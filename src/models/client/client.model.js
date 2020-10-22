const BaseModel = require('@pubsweet/base-model')
const logger = require('@pubsweet/logger')
const config = require('config')
const bcrypt = require('bcrypt')

const BCRYPT_COST = config.util.getEnv('NODE_ENV') === 'test' ? 1 : 12

class Client extends BaseModel {
  static get tableName() {
    return 'clients'
  }

  constructor(properties) {
    super(properties)
    this.type = 'client'
  }

  /* eslint-disable no-param-reassign */
  $formatJson(json) {
    json = super.$formatJson(json)
    delete json.clientSecretHash
    return json
  }

  static get schema() {
    return {
      properties: {
        clientSecret: { type: 'string' },
        clientSecretHash: { type: 'string' },
      },
    }
  }

  async hashClientSecret(cs) {
    this.clientSecretHash = await bcrypt.hash(cs, BCRYPT_COST)
    delete this.clientSecret
  }

  async validClientSecret(cs) {
    return cs && this.clientSecretHash
      ? bcrypt.compare(cs, this.clientSecretHash)
      : false
  }

  async $beforeInsert(queryContext) {
    super.$beforeInsert()
    if (this.clientSecret) await this.hashClientSecret(this.clientSecret)
  }

  /* eslint-disable class-methods-use-this */
  async save() {
    logger.error('Base model: save method has been disabled')
  }
}

module.exports = Client
