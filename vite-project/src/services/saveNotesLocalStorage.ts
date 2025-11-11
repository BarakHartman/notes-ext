import { getStorage, setStorage } from "./localStorageService";
import type { Note } from "../types";

function getNotesLength(): number {
    return getStorage('notes').length;
  }
  
  function setNotes(notes: Note[]) {
    setStorage('notes', notes);
  }
  
  function setLastNoteId(id: number) {
    setStorage('lastNoteId', id);
  }
  
  function getLastNoteId(): number {
      try {
          return Number.parseInt(getStorage('lastNoteId')) || 0;
      } catch (error) {
          console.error('Error getting last note id:', error);
          throw error;
      }
  }
  
  function getNotes(): Note[] {
    return getStorage('notes');
  }
  
  export {getNotesLength, setNotes, setLastNoteId, getLastNoteId, getNotes };