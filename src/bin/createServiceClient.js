#!/usr/bin/env node

const cryptoRandomString = require('crypto-random-string')
const { logger } = require('@coko/server')

const { models } = require('../models')

const { ServiceClient } = models

const main = async () => {
  try {
    logger.info('Generating new client')
    const clientSecret = cryptoRandomString({
      length: 16,
      type: 'alphanumeric',
    })
    const dbClient = await ServiceClient.query().insert({ clientSecret })
    logger.info(`Your clientID is ${dbClient.id}`)
    logger.info(`Your clientSecret is ${clientSecret}`)
    return true
  } catch (e) {
    throw new Error(e)
  }
}

main()
