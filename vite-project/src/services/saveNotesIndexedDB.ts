import indexedDBService from './indexedDBService'
import type { Note, StorageStrategy } from '../types'

/**
 * IndexedDB Storage Strategy Implementation
 * Service layer that uses IndexedDB for notes persistence
 * This mirrors the localStorage service but uses IndexedDB instead
 */

async function getNotesLength(): Promise<number> {
  return await indexedDBService.countNotes()
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

async function setLastNoteId(id: number): Promise<void> {
  await indexedDBService.setMetadata('lastNoteId', id)
}

async function getLastNoteId(): Promise<number> {
  try {
    const id = await indexedDBService.getMetadata('lastNoteId')
    return Number.parseInt(String(id)) || 0
  } catch (error) {
    console.error('Error getting last note id:', error)
    throw error
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
  getLastNoteId,
  setLastNoteId,
  getNotesLength
};

export default indexedDBStrategy;
export { getNotesLength, setNotes, setLastNoteId, getLastNoteId, getNotes }

