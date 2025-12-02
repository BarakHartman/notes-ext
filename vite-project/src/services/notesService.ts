import type {Note, StorageStrategy} from '../types'
import { useNotesStore } from '../store/useNotesStore'

let storageStrategy: StorageStrategy | null = null

/**
 * Initialize the service with a storage strategy
 * @param strategy - The storage strategy to use (localStorage or IndexedDB)
 */
async function initService(strategy: StorageStrategy){
    console.log('Initializing notes service with storage strategy...');
    storageStrategy = strategy
    
    let notes: Note[]
    try {
        notes = await strategy.getNotes() || []
    } catch (error) {
        console.error('Error initializing notes service:', error)
        notes = []
    }

    useNotesStore.getState().setNotes(notes)
}

async function addNote(text: string){
    const serializedText = text.trim()
    if (!storageStrategy) {
        console.error('Storage strategy not initialized')
        return
    }
    
    try {
        // Save to storage and update lastNoteId
        const newNote = await storageStrategy.addNote(serializedText)
        console.log(`new note: ${newNote}`);
        
        // Update local state immediately for responsive UI
        // altenatively we get fetch notes from store, add the new one (hard ocding it) and re-set it
        const notes = await storageStrategy.getNotes()
        useNotesStore.getState().setNotes(notes)
    } catch (error) {
        console.error('Error saving note to storage:', error)
        throw error
    }
}

function removeNote(id: number){
    // todo
    // notes = notes.filter(n => n.id !== id)
}

export {
    addNote,
    removeNote,
    initService
}