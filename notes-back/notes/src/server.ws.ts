import { IncomingMessage, ServerResponse, Server } from 'http'
import WebSocket from 'ws'

import { ISocketPrivateMessage } from './types/ws'

import { WebSocketHelper } from './infrastructure/helpers/ws'
import { AuthenticateUser } from './infrastructure/middlewares/authentication'

import { NotesControllerWs } from './notes/notes.controller.ws'
import { NotesRepository } from './notes/notes.repository'
import { NotesService } from './notes/notes.service'

export function bootstrapWss(
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) {
  const wss = new WebSocket.Server({ server })

  const notesRepository = new NotesRepository()
  const notesService = new NotesService(notesRepository)

  wss.on('connection', async ws => {
    const wsHelper = new WebSocketHelper(ws)
    const notesController = new NotesControllerWs(wsHelper, notesService)

    ws.send('Hi there, I am a WebSocket server')
    ws.on('error', e => ws.send(Buffer.from(e.message)))
    ws.on('close', (code, reason) =>
      console.log(`Code: ${code}; Reason: ${reason.toString()}`),
    )

    ws.on('message', message => {
      try {
        const parsedMessage = JSON.parse(
          message.toString(),
        ) as ISocketPrivateMessage
        const { event, token } = parsedMessage

        AuthenticateUser.authenticate(token)

        if (event.startsWith(NotesControllerWs.EVENT_PREFIX)) {
          return notesController.handleMessage(parsedMessage)
        }
        if (event === 'ping') {
          return wsHelper.send('pong')
        }
        throw new Error('Wrong query')
      } catch (e) {
        wsHelper.send((e as Error).message)
      }
    })
  })

  /* Not sure is is a good practice to to authentication check inside upgrade
    https://ably.com/blog/websocket-authentication
    https://www.npmjs.com/package/ws#client-authentication
    
    server.on('upgrade', function upgrade(request, socket, head) {
       function onSocketError(err: Error) {
        console.error(err);
      }
      socket.on('error', onSocketError);
      authenticate(request, function next(err, client) {
        if (err || !client) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }
   
        socket.removeListener('error', onSocketError);
        
        wss.handleUpgrade(request, socket, head, function done(ws) {
          userSockets.set(client.id, ws)
          wss.emit('connection', ws, request);
        });
      });
    });
    */
}
