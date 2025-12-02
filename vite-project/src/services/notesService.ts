import type { Note, StorageStrategy } from '../types'
import { useNotesStore } from '../store/useNotesStore'

class NotesService {
  private storageStrategy: StorageStrategy | null = null

  /**
   * Initialize the service with a storage strategy
   * @param strategy - The storage strategy to use (localStorage or IndexedDB)
   */
  async initService(strategy: StorageStrategy): Promise<void> {
    console.log('Initializing notes service with storage strategy...')
    this.storageStrategy = strategy

    let notes: Note[]
    try {
      notes = (await strategy.getNotes()) || []
    } catch (error) {
      console.error('Error initializing notes service:', error)
      notes = []
    }

    useNotesStore.getState().setNotes(notes)
  }

  async addNote(text: string): Promise<void> {
    const serializedText = text.trim()
    if (!this.storageStrategy) {
      console.error('Storage strategy not initialized')
      return
    }

    try {
      const newNote = await this.storageStrategy.addNote(serializedText)
      console.log(`new note: ${newNote}`)

      // Alternatively we could read from the store and append, but this keeps storage as the source of truth
      const notes = await this.storageStrategy.getNotes()
      useNotesStore.getState().setNotes(notes)
    } catch (error) {
      console.error('Error saving note to storage:', error)
      throw error
    }
  }

  removeNote(id: number): void {
    // TODO: implement remove once strategies support it
    console.warn('removeNote is not implemented yet. Requested id:', id)
  }
}

const notesService = new NotesService()

export default notesService
export { NotesService }