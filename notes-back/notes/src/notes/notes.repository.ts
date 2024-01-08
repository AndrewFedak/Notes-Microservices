import { NoteDataModel } from '../config/data-models/product'

import { Note } from './notes.entity'

export interface INotesRepository {
  create(note: Note): Promise<void>
  update(note: Note): Promise<void>
  getListOfNotes(): Promise<Note[]>
  getNoteById(productId: string): Promise<Note | null>
}

export class NotesRepository implements INotesRepository {
  async create(note: Note): Promise<void> {
    const noteDataModel = await NoteDataModel.create(
      NoteDataModel.fromDomain(note),
    )
    if (!noteDataModel) {
      throw new Error('Note was not created')
    }
  }
  async update(note: Note): Promise<void> {
    const noteDataModel = await NoteDataModel.updateOne(
      { _id: note.id },
      { $set: NoteDataModel.fromDomain(note) },
    )
    if (!noteDataModel) {
      throw new Error('Note was not updated')
    }
  }
  async getListOfNotes(): Promise<Note[]> {
    const notes = await NoteDataModel.find()
    return notes.map(NoteDataModel.toDomain)
  }
  async getNoteById(noteId: string): Promise<Note | null> {
    const note = await NoteDataModel.findById(noteId)
    if (!note) {
      return null
    }
    return NoteDataModel.toDomain(note)
  }
}
