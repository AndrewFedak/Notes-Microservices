import React, { PropsWithChildren, createContext, useEffect, useState } from "react"

import { WS_NOTES_API_URL } from "../constants/api"

import { ISocketRequestMessage, ISocketResponseMessage } from "../types/ws";

const socket = new WebSocket(WS_NOTES_API_URL)
const eventListenersMap = new Map<string, Set<(payload: any) => void>>();

socket.addEventListener('close', (e: CloseEvent) => {
    console.log(e)
})

socket.addEventListener('message', ({ data }) => {
    try {
        const parsedData = JSON.parse(data) as ISocketResponseMessage;
        const messageEventName = parsedData.event
        const eventListeners = eventListenersMap.get(messageEventName);
        if (eventListeners) {
            eventListeners.forEach((cb) => cb(parsedData.payload))
        }
    } catch (e) {
    }
})

const wsEventSubscribe = <T,>(eventName: string, listener: (payload: ISocketResponseMessage<T>['payload']) => void) => {
    if (eventListenersMap.has(eventName) === false) {
        eventListenersMap.set(eventName, new Set([listener]))
    } else {
        eventListenersMap.get(eventName)?.add(listener)
    }
    return () => {
        const eventListeners = eventListenersMap.get(eventName)!;
        eventListeners.delete(listener)
        if (eventListeners.size === 0) {
            eventListenersMap.delete(eventName)
        }
    }
}

export const wsEventSend = <TRequest extends ISocketRequestMessage,>(body: TRequest) => {
    const wsSendPacket = JSON.stringify(body)
    socket.send(wsSendPacket)
}

export const useWSEventSubscribe = <T,>(eventName: string, listener: (payload: T) => void) => {
    useEffect(() => {
        const unsubscribe = wsEventSubscribe(eventName, listener)
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

export const useWSEventFetchObserve = <TResponse, TRequest extends ISocketRequestMessage>(requestPayload: TRequest) => {
    const [data, setData] = useState<TResponse | null>(null)

    useEffect(() => {
        const unsubscribe = wsEventSubscribe<TResponse>(requestPayload.event, (payload) => setData(payload))
        wsEventSend(requestPayload)
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return data
}

export const useWSEventFetch = <TResponse, TRequest extends ISocketRequestMessage>(requestPayload: TRequest) => {
    const [data, setData] = useState<TResponse | null>(null)

    useEffect(() => {
        const unsubscribe = wsEventSubscribe<TResponse>(requestPayload.event, (payload) => {
            setData(payload)
            unsubscribe()
        })
        wsEventSend(requestPayload)
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return data
}

const WSContext = createContext<WebSocket | null>(null)

export const WSProvider = ({ children }: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const setSocketIsOpen = () => setIsOpen(true)
        if (socket.readyState === socket.OPEN) {
            setSocketIsOpen()
        }
        socket.addEventListener('open', setSocketIsOpen)
        return () => {
            socket.removeEventListener('open', setSocketIsOpen)
        }
    }, [])

    if (isOpen === false) {
        return <>{'Connecting to socket'}</>;
    }

    return (
        <WSContext.Provider value={socket}>
            {children}
        </WSContext.Provider>
    )
}