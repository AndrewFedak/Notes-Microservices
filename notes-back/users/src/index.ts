import http from 'http'
import * as dotenv from 'dotenv'

import * as database from './config/db'

import { bootstrap as bootstrapHttpServer } from './server'

async function bootstrap() {
  dotenv.config()

  const mongoose = await database.mongoDBConnect()
  const httpServer = http.createServer(await bootstrapHttpServer())

  const port = process.env.PORT
  
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })

  const gracefulShutdown = () => {
    console.log('Closing http server.');
    httpServer.close(async () => {
      console.log('Http server closed.');
      await mongoose.connection.close(false)
      console.log('MongoDb connection closed.');
      process.exit(0);
    });
  }

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}
bootstrap()
