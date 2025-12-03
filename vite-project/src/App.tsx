import { useEffect } from 'react'
import './style/App.css'
import { NotesService } from './services/notesService'
import InputSelection from './InputSelection'
// Import storage strategies
import localStorageStrategy from './services/saveNoteStrategy/localStorage'
import indexedDBStrategy from './services/saveNoteStrategy/indexedDB'
import { useNotesStore } from './store/useNotesStore'
import type { Note } from './types'

// Choose which storage strategy to use
// Change this to 'indexedDB' to use IndexedDB, or 'localStorage' for localStorage
type StorageType = 'localStorage' | 'indexedDB'
const STORAGE_STRATEGY: StorageType = 'indexedDB' // or 'indexedDB'

const notesService = new NotesService()
function App() {
  const notes = useNotesStore((state: { notes: Note[] }) => state.notes)
  
  useEffect(() => {
    // Initialize service with the chosen storage strategy
    const strategy = STORAGE_STRATEGY === 'indexedDB' ? indexedDBStrategy : localStorageStrategy
    notesService.initService(strategy).catch(err => {
      console.error('Failed to initialize notes service:', err)
    })

  },[])
  
  const handleAddNote = (inputValue: string) => {
    if (inputValue.trim() !== '') {
      notesService.addNote(inputValue)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Notes!</h1>
        
        <InputSelection addNote={handleAddNote} />

        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="empty-state">No notes yet. Add one above!</p>
          ) : (
            notes.map((note: Note) => (
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
