import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import { WSProvider } from './hooks/use-ws'

import { Notes } from './components/Notes'
import { ViewNote, CreateNote, EditNote } from './components/Note'
import { Login } from './components/Authenticate/Login'

function App() {
  return (
    <WSProvider>
      <Routes>
        <Route path='/notes'>
          <Route index element={<Notes />} />
          <Route path=':noteId' element={<ViewNote />} />
          <Route path='create' element={<CreateNote />} />
          <Route path='edit' element={<EditNote />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='*' element={
          <>
            <Link to={'/notes'}>Go to notes</Link>
          </>
        } />
      </Routes>
    </WSProvider>
  )
}

export default App
