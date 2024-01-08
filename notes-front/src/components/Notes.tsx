import React from 'react';
import { Link } from 'react-router-dom';

import { ISocketRequestPrivateMessage } from '../types/ws';
import { INote } from '../types/Note';

import { useWSEventFetchObserve } from '../hooks/use-ws';
import { useAuth } from '../hooks/use-auth';

export const Notes = () => {
  const { token } = useAuth()
  const notes = useWSEventFetchObserve<INote[], ISocketRequestPrivateMessage>({
    event: 'notes/findAll',
    token
  })

  if (notes === null) {
    return <>{'loading...'}</>
  }

  return (
    <div>
      <h4>Notes</h4>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <Link to={note.id}>(#{note.id}) <b>{note.title}</b></Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
