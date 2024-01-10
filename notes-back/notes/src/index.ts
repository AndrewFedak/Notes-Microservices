import http from 'http'
import * as dotenv from 'dotenv'

import { mongoDBConnect } from './config/db'
import { rabbitMQConnect } from './config/rabbitmq'

import { bootstrapHttpServer } from './server.http'
import { bootstrapWss } from './server.ws'

async function bootstrap() {
  dotenv.config()

  const mongoose = await mongoDBConnect()
  const rabbitMQ = await rabbitMQConnect()

  const httpServer = http.createServer(bootstrapHttpServer())
  const wss = bootstrapWss(httpServer)

  const port = process.env.PORT
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })

  const gracefulShutdown = () => {
    console.log('Closing WebSocket server gracefully');
  
    wss.close(() => {
      console.log('WebSocket server closed');
      httpServer.close(async () => {
        console.log('Http server closed.');
        await mongoose.connection.close(false)
        console.log('MongoDb connection closed.');
        await rabbitMQ.close()
        console.log('RabbitMQ connection closed.');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}
bootstrap()
