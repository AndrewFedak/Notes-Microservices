export type ISocketRequestMessage<Body = unknown, Payload = unknown> = Body & {
    event: string
} & (Payload extends unknown ? unknown : { payload: Payload })

export type ISocketRequestPrivateMessage<Body = unknown, Payload = unknown> = ISocketRequestMessage<Body, Payload> & {
    token: string
}

export interface ISocketResponseMessage<T = any> {
    event: string
    payload: T
}