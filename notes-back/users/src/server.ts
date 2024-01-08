import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import * as database from './config/db'

import { ExceptionFilter } from './infrastructure/exceptions/exception-filter'

import { UsersRepository } from './users/users.repository'

import { AuthenticationController } from './authentication/authentication.controller'
import { AuthenticationRepository } from './authentication/authentication.repository'
import { AuthenticationService } from './authentication/authentication.service'

export async function bootstrap() {
  dotenv.config()

  await database.connect()

  const authenticationService = new AuthenticationService(
    new UsersRepository(),
    new AuthenticationRepository(),
  )

  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use(AuthenticationController.init(authenticationService))
  app.use(ExceptionFilter)

  return app
}
