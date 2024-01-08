import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'

import { INote } from '../../types/Note';
import { ISocketRequestPrivateMessage } from '../../types/ws';

import { useWSEventFetchObserve } from '../../hooks/use-ws';
import { useAuth } from '../../hooks/use-auth';

type ViewNoteSocketRequest = ISocketRequestPrivateMessage<Pick<INote, 'id'>>

export const ViewNote = () => {
    const { noteId } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()
    const note = useWSEventFetchObserve<INote, ViewNoteSocketRequest>({
        event: 'notes/view',
        token,
        id: noteId!
    })

    const onEdit = () => {
        navigate('/notes/edit', { state: { note } })
    }

    if (note === null) {
        return <>{'loading...'}</>
    }

    return (
        <div>
            <Link to={'/notes'}>Go back to notes</Link><br/>
            <b>#{note.id}</b>
            <h4>{note.title}</h4>
            <p>{note.description}</p>
            <button onClick={onEdit}><b>Edit</b></button>
        </div>
    )
}
