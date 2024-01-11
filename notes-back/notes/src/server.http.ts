import express, { Express } from 'express'

import { ExceptionFilter } from './infrastructure/middlewares/exception-filter'
import { AuthenticationMiddleware } from './infrastructure/middlewares/authentication'
import { ErrorLoggerMiddleware, RequestLoggerMiddleware } from './infrastructure/middlewares/logger'

import { NotesController } from './notes/notes.controller.http'
import { NotesRepository } from './notes/notes.repository'
import { NotesService } from './notes/notes.service'

export function bootstrapHttpServer(): Express {
  const notesRepository = new NotesRepository()
  const notesService = new NotesService(notesRepository)

  const app = express()

  app.use(express.json())
  app.use(RequestLoggerMiddleware)
  
  app.get('/healthz', (req, res) => {
    res.status(200).send('Healthy')
  })

  app.use(
    AuthenticationMiddleware.authenticate,
    NotesController.init(notesService),
  )

  app.use(ErrorLoggerMiddleware)
  app.use(ExceptionFilter)

  return app
}
