import { Schema, model } from 'mongoose'

import { Note as NoteDomain } from '@src/notes/notes.entity'

export interface INote {
  _id: string
  title: string
  description: string
  owner_id: string
}
export const noteSchema = new Schema<INote>({
  _id: { type: 'String' },
  title: { type: 'String' },
  description: { type: 'String' },
  owner_id: { type: 'String' },
})
const Note = model<INote>('Note', noteSchema)

export class NoteDataModel extends Note {
  constructor(data: INote) {
    super(data)
  }

  static toDomain({ _id, title, description, owner_id }: INote): NoteDomain {
    return new NoteDomain(_id, title, description, owner_id)
  }

  static fromDomain({ id, title, description, ownerId }: NoteDomain): INote {
    return new Note<INote>({ _id: id, title, description, owner_id: ownerId })
  }
}
