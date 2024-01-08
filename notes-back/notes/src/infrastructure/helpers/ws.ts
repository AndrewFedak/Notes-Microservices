import WebSocket from 'ws'

export class WebSocketHelper {
  constructor(private ws: WebSocket) {}

  sendBinary(data: Buffer) {
    this.ws.send(data)
  }

  sendEventJson(eventName: string, payload: object | string) {
    this.ws.send(
      JSON.stringify({
        event: eventName,
        payload,
      }),
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(data: any) {
    this.ws.send(data)
  }
}
