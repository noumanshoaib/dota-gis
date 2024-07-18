'use strict'

const fastify = require('fastify')
const fastifyEnv = require('@fastify/env')
const env = require('./env')

async function build (opts = {}) {
  const app = fastify(opts)

  // CORS
  app.register(require('@fastify/cors'), {})

  // Compression
  app.register(require('@fastify/compress'))

  // Plugin Registration
  // Set up the environment variables
  app.register(fastifyEnv, env.options)
  // wait for the environment to be fully loaded
  await app.after()

  // Health check
  app.register(require('../plugins/healthCheck'))

  // auth check
  app.register(require('../plugins/auth'))

  // Register routes
  app.register(require('../routes'))

  //registering socket io
  app.register(require("../plugins/fastifySocketIo"), {
    cors: {
      origin: "*", // Replace with your allowed origin(s)
      methods: ["GET", "POST"]
    }
  });


  return app
}

module.exports = build
