import indexedDBService from './indexedDBService'
import type { Note, StorageStrategy } from '../../../types'

/**
 * IndexedDB Storage Strategy Implementation
 * Service layer that uses IndexedDB for notes persistence
 * This mirrors the localStorage service but uses IndexedDB instead
 */

async function addNote(serializedText: string): Promise<Note> {
  const lastId = await indexedDBService.getMetadata('lastNoteId')
  const newId = (Number.parseInt(String(lastId)) || 0) + 1
  const newNote: Note = {
    id: newId,
    text: serializedText
  }
  
  await indexedDBService.putNote(newNote)
  await indexedDBService.setMetadata('lastNoteId', newId)
  
  return newNote
}

async function setNotes(notes: Note[]): Promise<void> {
  // Clear existing notes and add all new ones
  // Note: In a production app, you might want to be smarter about
  // only updating changed notes to avoid unnecessary writes
  await indexedDBService.clearAllNotes()
  
  // Add all notes in a transaction (more efficient)
  // For simplicity, we'll add them one by one
  // In production, you could batch them in a single transaction
  for (const note of notes) {
    await indexedDBService.putNote(note)
  }
}

async function getNotes(): Promise<Note[]> {
  return await indexedDBService.getAllNotes()
}

// Initialize IndexedDB when this module is imported
// This ensures the database is ready before any operations
indexedDBService.init().catch((error) => {
  console.error('Failed to initialize IndexedDB:', error)
})

// Export as a strategy object that implements StorageStrategy interface
const indexedDBStrategy: StorageStrategy = {
  getNotes,
  setNotes,
  addNote
};

export default indexedDBStrategy;

