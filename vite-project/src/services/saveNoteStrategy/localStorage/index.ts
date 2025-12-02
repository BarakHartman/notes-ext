import { getStorage, setStorage } from "../localStorageService";
import type { Note, StorageStrategy } from "../../../types";

/**
 * localStorage Storage Strategy Implementation
 * All methods are async to match the StorageStrategy interface
 * (Even though localStorage is synchronous, we wrap it in promises for consistency)
 */

async function getNotesLength(): Promise<number> {
  return Promise.resolve(getStorage('notes').length);
}

async function setNotes(notes: Note[]): Promise<void> {
  return Promise.resolve(setStorage('notes', notes));
}

async function setLastNoteId(id: number): Promise<void> {
  return Promise.resolve(setStorage('lastNoteId', id));
}

async function getLastNoteId(): Promise<number> {
  try {
    return Promise.resolve(Number.parseInt(getStorage('lastNoteId')) || 0);
  } catch (error) {
    console.error('Error getting last note id:', error);
    throw error;
  }
}

async function getNotes(): Promise<Note[]> {
  return Promise.resolve(getStorage('notes'));
}

// Export as a strategy object that implements StorageStrategy interface
const localStorageStrategy: StorageStrategy = {
  getNotes,
  setNotes,
  getLastNoteId,
  setLastNoteId,
  getNotesLength,
  addNote
};

export default localStorageStrategy;
export { getNotesLength, setNotes, setLastNoteId, getLastNoteId, getNotes };