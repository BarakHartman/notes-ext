import { useEffect, useState } from 'react'
import './style/App.css'
import {getNotes as getLocalNotes} from './services/saveNotesLocalStorage'
import {
  subscribeToNotesChanges,
  unsubscribeToNotrsChanges,
  addNote, getNextId, initService as initNotesService} from './services/notesService'
import type { Note } from './types'
import InputSelection from './InputSelection'
 
function App() {
  const [notes, setNotes] = useState<Note[]>(getLocalNotes() as Note[])
  const [nextId, setNextId] = useState(getNextId())
  
  useEffect(() => {
    const subIdx = subscribeToNotesChanges((notes, newNoteId) => {
      setNotes(notes)
      setNextId(newNoteId)
    })
    initNotesService()

    return () => {
      unsubscribeToNotrsChanges(subIdx)
    }
  },[])
  
  const handleAddNote = (inputValue: string) => {
    if (inputValue.trim() !== '') {
      const newNote: Note = {
        id: nextId,
        text: inputValue.trim()
      }
      
      addNote(newNote)
    }
  }


  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Notes</h1>
        
        <InputSelection addNote={handleAddNote} />

        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="empty-state">No notes yet. Add one above!</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note" id={`${note.id}`}>
                {note.text} - id: {note.id}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
