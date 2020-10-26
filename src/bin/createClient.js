#!/usr/bin/env node

const cryptoRandomString = require('crypto-random-string')
const logger = require('@pubsweet/logger')

const { models } = require('../models')

const { Client } = models
console.log('c', Client)

const main = async () => {
  try {
    logger.info('Generating new client')
    const clientSecret = cryptoRandomString({
      length: 16,
      type: 'alphanumeric',
    })
    const newClient = await Client.query().insert({ clientSecret })
    logger.info(`Your clientID is ${newClient.id}`)
    logger.info(`Your clientSecret is ${clientSecret}`)
    return true
  } catch (e) {
    throw new Error(e)
  }
}

main()
