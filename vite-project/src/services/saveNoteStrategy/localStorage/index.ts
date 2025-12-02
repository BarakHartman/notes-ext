import { getStorage, setStorage } from "../localStorageService";
import type { Note, StorageStrategy } from "../../../types";

/**
 * localStorage Storage Strategy Implementation
 * All methods are async to match the StorageStrategy interface
 * (Even though localStorage is synchronous, we wrap it in promises for consistency)
 */

async function addNote(serializedText: string): Promise<Note> {
  const newId = (Number.parseInt(getStorage('lastNoteId')) || 0) + 1
  const newNote: Note = {
    id: newId,
    text: serializedText
  }
  
  const notes = getStorage('notes')
  
  notes.push(newNote)

  setStorage('notes', notes)
  setStorage('lastNoteId', newId)
  
  return newNote;
}

async function setNotes(notes: Note[]): Promise<void> {
  return setStorage('notes', notes);
}

async function getNotes(): Promise<Note[]> {
  return getStorage('notes');
}

// Export as a strategy object that implements StorageStrategy interface
const localStorageStrategy: StorageStrategy = {
  getNotes,
  setNotes,
  addNote
};

export default localStorageStrategy;