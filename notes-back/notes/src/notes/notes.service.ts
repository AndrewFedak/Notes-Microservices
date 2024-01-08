import { v4 as uuid } from 'uuid'
import { NotFoundException } from '../infrastructure/exceptions/not-found.exception'

import { INotesRepository } from './notes.repository'

import { CreateNoteDto } from './dto/create-note.dto'
import { UpdateNoteDto } from './dto/update-note.dto'

import { Note } from './notes.entity'

export class NotesService {
  constructor(private _notesRepository: INotesRepository) {}

  async update(note: UpdateNoteDto): Promise<Note> {
    await this._notesRepository.update(
      new Note(note.id, note.title, note.description, note.ownerId),
    )
    return await this.getSingleNote(note.id)
  }

  async create(note: CreateNoteDto): Promise<Note> {
    const noteId = uuid()
    await this._notesRepository.create(
      new Note(noteId, note.title, note.description, note.ownerId),
    )
    return await this.getSingleNote(noteId)
  }

  async getListOfNotes(): Promise<Note[]> {
    return await this._notesRepository.getListOfNotes()
  }

  async getSingleNote(noteId: string): Promise<Note> {
    const note = await this._notesRepository.getNoteById(noteId)
    if (!note) {
      throw new NotFoundException('No note with such id')
    }
    return note
  }
}
