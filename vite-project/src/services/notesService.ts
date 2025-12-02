import type {Note, NewNoteCallback, StorageStrategy} from '../types'

let notes: Note[] = []
const onNewNoteCB: NewNoteCallback[] = []
let storageStrategy: StorageStrategy | null = null

/**
 * Initialize the service with a storage strategy
 * @param strategy - The storage strategy to use (localStorage or IndexedDB)
 */
async function initService(strategy: StorageStrategy){
    console.log('Initializing notes service with storage strategy...');
    storageStrategy = strategy
    
    try {
        notes = await strategy.getNotes() || []
        onNewNoteCB.forEach(cb => cb(notes))
    } catch (error) {
        console.error('Error initializing notes service:', error)
        notes = []
        onNewNoteCB.forEach(cb => cb(notes))
    }
}

function setNotes(newNotes: Note[]){
    notes = [...newNotes]
    // Save to storage (async, but we don't wait - fire and forget)
    if (storageStrategy) {
        storageStrategy.setNotes(notes).catch(err => console.error('Error saving notes:', err))
    }
    onNewNoteCB.forEach(cb => cb(notes))
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
        const updatedNotes = await storageStrategy.getNotes()
        notes = updatedNotes // or alternatively: notes.push(newNote) w/o fectching all notes again
        
        // Notify subscribers
        onNewNoteCB.forEach(cb => cb(notes))
    } catch (error) {
        console.error('Error saving note to storage:', error)
        // Rollback local state on error
        notes = notes.slice(0, -1)
        throw error
    }
}

function removeNote(id: number){
    notes = notes.filter(n => n.id !== id)
}

function getNotes(): Note[]{
    return notes
}

function subscribeToNotesChanges(callback: NewNoteCallback){
    return onNewNoteCB.push(callback) - 1
}

function unsubscribeToNotrsChanges(subIdx: number) {
    delete onNewNoteCB[subIdx]
    //todo: handle undefined (problem because other will get thei idxs based on the array before the undefined removal)
}
export {setNotes, addNote,
    removeNote, getNotes,
    subscribeToNotesChanges, unsubscribeToNotrsChanges,
    initService}