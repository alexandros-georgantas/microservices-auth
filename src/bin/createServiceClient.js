#!/usr/bin/env node

const cryptoRandomString = require('crypto-random-string')
const logger = require('@pubsweet/logger')
const config = require('config')

const { models } = require('../models')

const { ServiceClient } = models

const manualClientId = config.get('clientId')
const manualClientSecret = config.get('clientSecret')
const isManualOperation = () =>
  process.env.NODE_ENV === 'development' && manualClientId && manualClientSecret

const main = async () => {
  try {
    logger.info('Generating new client')
    let newClient
    if (isManualOperation) {
      logger.info('(dev profile): with provided values')
      newClient = {
        id: manualClientId,
        clientSecret: manualClientSecret,
      }
    } else {
      const clientSecret = cryptoRandomString({
        length: 16,
        type: 'alphanumeric',
      })
      newClient = {
        clientSecret,
      }
    }
    const dbClient = await ServiceClient.query().insert(newClient)
    logger.info(`Your clientID is ${dbClient.id}`)
    logger.info(`Your clientSecret is ${newClient.clientSecret}`)
    return true
  } catch (e) {
    throw new Error(e)
  }
}

main()
