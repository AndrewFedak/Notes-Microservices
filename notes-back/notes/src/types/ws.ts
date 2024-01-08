export type ISocketMessage<Body = unknown, Payload = unknown> = Body & {
  event: string
} & (Payload extends unknown ? unknown : { payload: Payload })

export type ISocketPrivateMessage<
  Body = unknown,
  Payload = unknown,
> = ISocketMessage<Body, Payload> & {
  token: string
}
