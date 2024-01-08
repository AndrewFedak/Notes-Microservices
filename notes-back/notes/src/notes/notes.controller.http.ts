import express, { Router, RequestHandler } from 'express'

import { ResponseDataAndError } from '../infrastructure/response-data-and-error'
import { errorWrapper } from '../infrastructure/exceptions/handler-wrapper'

import { NotesService } from './notes.service'

export class NotesController {
  constructor(private _notesService: NotesService) {}

  static init(notesService: NotesService): Router {
    const router = express.Router()

    const notesController = new NotesController(notesService)

    router.get(`/`, notesController.getListOfNotes)
    router.get(`/:noteId`, notesController.getSingleNote)
    router.post(`/`, notesController.createNote)
    router.put(`/`, notesController.updateNote)

    return router
  }

  getListOfNotes: RequestHandler = errorWrapper(async (req, res) => {
    const notes = await this._notesService.getListOfNotes()
    res.status(200).json(ResponseDataAndError.format(notes))
  })

  getSingleNote: RequestHandler = errorWrapper(async (req, res) => {
    const notes = await this._notesService.getSingleNote(req.params.noteId)
    res.status(200).json(ResponseDataAndError.format(notes))
  })

  createNote: RequestHandler = errorWrapper(async (req, res) => {
    const note = await this._notesService.create(req.body)
    res.status(200).json(ResponseDataAndError.format(note))
  })

  updateNote: RequestHandler = errorWrapper(async (req, res) => {
    const note = await this._notesService.update(req.body)
    res.status(200).json(ResponseDataAndError.format(note))
  })
}
