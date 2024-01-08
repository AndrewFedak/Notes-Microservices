import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ISocketRequestPrivateMessage } from "../../types/ws";
import { INote } from "../../types/Note";

import { useWSEventSubscribe, wsEventSend } from "../../hooks/use-ws";
import { useAuth } from "../../hooks/use-auth";

import { INoteForm, NoteForm } from "./NoteForm";

interface IEditNote {
    note: INote
}

export const EditNote: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuth()
    const location = useLocation();
    const [note, setNote] = useState((location.state as IEditNote).note)

    const eventName = 'notes/update'
    useWSEventSubscribe(eventName, () => {
        navigate(`/notes/${note.id}`)
    })

    const onEditSubmit: INoteForm['onSubmit'] = () => {
        wsEventSend<ISocketRequestPrivateMessage<INote>>({
            event: eventName,
            token,
            ...note
        })
    }

    const onEditNote: INoteForm['onChange'] = (propName, value) => {
        setNote(prevNoteState => ({
            ...prevNoteState,
            [propName]: value
        }))
    }

    return (
        <NoteForm note={note} onChange={onEditNote} onSubmit={onEditSubmit} />
    )
}