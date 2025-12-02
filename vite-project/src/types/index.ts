export interface Note {
    id?: number
    text: string
}

export interface SignedNote extends Note {
  id: number
}

export type NewNoteCallback = (notes: Note[]) => void

/**
 * Storage Strategy Interface
 * Both localStorage and IndexedDB implementations must follow this interface
 * All methods are async to support IndexedDB's async nature
 */
export interface StorageStrategy {
  getNotes(): Promise<Note[]>
  setNotes(notes: Note[]): Promise<void>
  addNote(serializedText: string): Promise<Note>
}