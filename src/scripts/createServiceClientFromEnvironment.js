#!/usr/bin/env node
const config = require('config')
const { logger } = require('@coko/server')

const ServiceClient = require('../models/service-client/service-client.model')

const createServiceClientFromEnvironment = async () => {
  try {
    const isProduction = process.env.NODE_ENV === 'production'

    let clientID
    let clientSecret

    // for production allow undefined for clientID and clientSecret for the case of manual script execution
    if (isProduction) {
      clientID = config.has('clientID') && config.get('clientID')
      clientSecret = config.has('clientSecret') && config.get('clientSecret')
    } else {
      // for development make sure that you will have values for clientID and clientSecrete regardless of env values
      clientID =
        (config.has('clientID') && config.get('clientID')) ||
        '59a3392b-0c4f-4318-bbe2-f86eff6d3de4'
      clientSecret =
        (config.has('clientSecret') && config.get('clientSecret')) ||
        'asldkjLKJLaslkdf897kjhKUJH'
    }

    // case where you haven't provided values via env and you will manually generate them, so do nothing here
    if (isProduction && (!clientID || !clientSecret)) {
      return false
    }

    if (!clientID) {
      throw new Error(
        'Service-auth: createServiceClientFromEnvironment: clientID is undefined',
      )
    }

    if (!clientSecret) {
      throw new Error(
        'Service-auth: createServiceClientFromEnvironment: clientSecret is undefined',
      )
    }

    const exists = await ServiceClient.query().findById(clientID)

    if (!exists) {
      logger.info(
        'Service-auth: createServiceClientFromEnvironment: creating new client from environment',
      )

      await ServiceClient.query().insert({
        id: clientID,
        clientSecret,
      })

      logger.info(
        'Service-auth: createServiceClientFromEnvironment: successfully created new client from environment',
      )
      return true
    }

    logger.info(
      'Service-auth: createServiceClientFromEnvironment: client credentials already exist',
    )
    return false
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { createServiceClientFromEnvironment }
