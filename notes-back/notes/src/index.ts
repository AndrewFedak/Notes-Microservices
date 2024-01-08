import http from 'http'
import * as dotenv from 'dotenv'

import { mongoDBConnect } from './config/db'
import { rabbitMQConnection } from './config/rabbitmq'

import { bootstrapHttpServer } from './server.http'
import { bootstrapWss } from './server.ws'

async function bootstrap() {
  dotenv.config()

  await mongoDBConnect()
  await rabbitMQConnection()

  const httpServer = http.createServer(bootstrapHttpServer())
  bootstrapWss(httpServer)

  const port = process.env.PORT
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}
bootstrap()
