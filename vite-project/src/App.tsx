import { useEffect, useState } from 'react'
import './style/App.css'
import {
  subscribeToNotesChanges,
  unsubscribeToNotrsChanges,
  addNote, initService as initNotesService} from './services/notesService'
import type { Note } from './types'
import InputSelection from './InputSelection'
// Import storage strategies
import localStorageStrategy from './services/saveNotesLocalStorage'
import indexedDBStrategy from './services/saveNotesIndexedDB'

// Choose which storage strategy to use
// Change this to 'indexedDB' to use IndexedDB, or 'localStorage' for localStorage
type StorageType = 'localStorage' | 'indexedDB'
const STORAGE_STRATEGY: StorageType = 'localStorage' // or 'indexedDB'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [nextId, setNextId] = useState(1)
  
  useEffect(() => {
    const subIdx = subscribeToNotesChanges((notes, newNoteId) => {
      setNotes(notes)
      setNextId(newNoteId)
    })
    
    // Initialize service with the chosen storage strategy
    const strategy = STORAGE_STRATEGY === 'indexedDB' ? indexedDBStrategy : localStorageStrategy
    initNotesService(strategy).catch(err => {
      console.error('Failed to initialize notes service:', err)
    })

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
