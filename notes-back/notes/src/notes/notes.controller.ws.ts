import {
  channel,
  consumeFromExchange,
  publishToExchange,
} from '@src/config/rabbitmq'

import { WebSocketHelper } from '@src/infrastructure/helpers/ws'

import { ISocketMessage } from '@src/types/ws'

import { CreateNoteDto } from './dto/create-note.dto'
import { UpdateNoteDto } from './dto/update-note.dto'
import { ViewNoteDto } from './dto/view-note.dto'

import { NotesService } from './notes.service'

export class NotesControllerWs {
  static EVENT_PREFIX = 'notes/'

  events = {
    FIND_ALL_NOTES: NotesControllerWs.EVENT_PREFIX + 'findAll',
    CREATE_NOTE: NotesControllerWs.EVENT_PREFIX + 'create',
    UPDATE_NOTE: NotesControllerWs.EVENT_PREFIX + 'update',
    VIEW_NOTE: NotesControllerWs.EVENT_PREFIX + 'view',
    STOP_VIEW_NOTE: NotesControllerWs.EVENT_PREFIX + 'stopView',
  }
  exchanges = {
    VIEW_NOTE: (noteId: string) => `note-${noteId}-view`,
  }

  private queueConsumerTag: Map<string, string> = new Map()

  constructor(
    private _wsh: WebSocketHelper,
    private _notesService: NotesService,
  ) {}

  async handleMessage(msg: ISocketMessage) {
    const { event } = msg
    if (event === this.events.FIND_ALL_NOTES) {
      return await this.getAllNotes()
    }
    if (event === this.events.CREATE_NOTE) {
      return await this.createNote(msg as ISocketMessage<CreateNoteDto>)
    }
    if (event === this.events.UPDATE_NOTE) {
      return await this.updateNote(msg as ISocketMessage<UpdateNoteDto>)
    }
    if (event === this.events.VIEW_NOTE) {
      return await this.viewNote(msg as ISocketMessage<ViewNoteDto>)
    }
    if (event === this.events.STOP_VIEW_NOTE) {
      return await this.stopViewNote(msg as ISocketMessage<ViewNoteDto>)
    }

    this._wsh.send(new Error('Wrong query').message)
  }

  private getNote = (nodeId: string) => {
    return this._notesService.getSingleNote(nodeId)
  }

  private getAllNotes = async () => {
    const notes = await this._notesService.getListOfNotes()
    this._wsh.sendEventJson(this.events.FIND_ALL_NOTES, notes)
  }

  private createNote = async (data: ISocketMessage<CreateNoteDto>) => {
    const { title, description, ownerId } = data
    const createdNote = this._notesService.create(
      new CreateNoteDto(title, description, ownerId),
    )
    this._wsh.sendEventJson(this.events.CREATE_NOTE, createdNote)
  }

  private updateNote = async (data: ISocketMessage<UpdateNoteDto>) => {
    const { id, title, description, ownerId } = data

    await this._notesService.update(
      new UpdateNoteDto(id, title, description, ownerId),
    )

    const viewExchange = this.exchanges.VIEW_NOTE(id)
    await publishToExchange(viewExchange, 'fanout')
    this._wsh.sendEventJson(this.events.UPDATE_NOTE, 'Note updated')
  }

  private viewNote = async ({ id: noteId }: ISocketMessage<ViewNoteDto>) => {
    const viewExchange = this.exchanges.VIEW_NOTE(noteId)
    const note = await this.getNote(noteId)
    this._wsh.sendEventJson(this.events.VIEW_NOTE, note)
    if (this.queueConsumerTag.has(viewExchange) === false) {
      const { consumerTag } = await consumeFromExchange(
        viewExchange,
        'fanout',
        async () => {
          const note = await this.getNote(noteId)
          this._wsh.sendEventJson(this.events.VIEW_NOTE, note)
        },
      )
      this.queueConsumerTag.set(viewExchange, consumerTag)
    }
  }

  private stopViewNote = async ({
    id: noteId,
  }: ISocketMessage<ViewNoteDto>) => {
    const viewExchange = this.exchanges.VIEW_NOTE(noteId)
    try {
      const consumerTag = this.queueConsumerTag.get(viewExchange)
      await channel.cancel(consumerTag!)
    } finally {
      this.queueConsumerTag.delete(viewExchange)
      this._wsh.sendEventJson(
        this.events.STOP_VIEW_NOTE,
        'Successfully stopped viewing',
      )
    }
  }
}
