import express, { Express } from 'express'

import { ExceptionFilter } from './infrastructure/exceptions/exception-filter'
import { AuthenticationMiddleware } from './infrastructure/middlewares/authentication'

import { NotesController } from './notes/notes.controller.http'
import { NotesRepository } from './notes/notes.repository'
import { NotesService } from './notes/notes.service'

export function bootstrapHttpServer(): Express {
  const notesRepository = new NotesRepository()
  const notesService = new NotesService(notesRepository)

  const app = express()

  app.use(express.json())
  app.use(
    AuthenticationMiddleware.authenticate,
    NotesController.init(notesService),
  )
  app.use(ExceptionFilter)

  return app
}
