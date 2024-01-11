import express from 'express'
import cors from 'cors'

import { ExceptionFilter } from './infrastructure/middlewares/exception-filter'
import { ErrorLoggerMiddleware, RequestLoggerMiddleware } from './infrastructure/middlewares/logger'

import { UsersRepository } from './users/users.repository'

import { AuthenticationController } from './authentication/authentication.controller'
import { AuthenticationRepository } from './authentication/authentication.repository'
import { AuthenticationService } from './authentication/authentication.service'

export async function bootstrap() {
  const authenticationService = new AuthenticationService(
    new UsersRepository(),
    new AuthenticationRepository(),
  )

  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(RequestLoggerMiddleware)

  app.get('/healthz', (req, res) => {
    res.status(200).send('Healthy')
  })

  app.use(AuthenticationController.init(authenticationService))

  app.use(ErrorLoggerMiddleware)
  app.use(ExceptionFilter)

  return app
}
