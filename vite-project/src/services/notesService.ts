import type {Note, NewNoteCallback, StorageStrategy} from '../types'

let notes: Note[] = []
const cbs: NewNoteCallback[] = []
let nextNodeId: number
let storageStrategy: StorageStrategy | null = null

/**
 * Initialize the service with a storage strategy
 * @param strategy - The storage strategy to use (localStorage or IndexedDB)
 */
async function initService(strategy: StorageStrategy){
    console.log('Initializing notes service with storage strategy...');
    storageStrategy = strategy
    
    try {
        const lastId = await strategy.getLastNoteId()
        nextNodeId = lastId + 1
        notes = await strategy.getNotes() || []
        cbs.forEach(cb => cb(notes, nextNodeId))
    } catch (error) {
        console.error('Error initializing notes service:', error)
        // Fallback to empty state
        nextNodeId = 1
        notes = []
        cbs.forEach(cb => cb(notes, nextNodeId))
    }
}

function setNotes(newNotes: Note[]){
    notes = [...newNotes]
    // Find the highest id to set nextNodeId
    if (notes.length > 0) {
        const currentLastNoteId = Math.max(...notes.map(n => n.id))
        nextNodeId = currentLastNoteId + 1
    } else {
        nextNodeId = 1
    }
    // Save to storage (async, but we don't wait - fire and forget)
    if (storageStrategy) {
        storageStrategy.setNotes(notes).catch(err => console.error('Error saving notes:', err))
    }
    cbs.forEach(cb => cb(notes, nextNodeId))
}

function addNote(note: Note){
    console.log(`new note: ${note}`);
    
    // Update local state immediately for responsive UI
    notes.push(note)
    nextNodeId = note.id + 1
    
    // Save to storage (async)
    if (storageStrategy) {
        storageStrategy.setNotes(notes)
            .then(() => storageStrategy!.setLastNoteId(note.id))
            .catch(error => {
                console.error('Error saving note to storage:', error)
                // Rollback local state on error
                notes = notes.filter(n => n.id !== note.id)
                nextNodeId = note.id
            })
    }
    
    // Notify subscribers
    cbs.forEach(cb => cb(notes, nextNodeId))
}

function removeNote(id: number){
    notes = notes.filter(n => n.id !== id)
}

function getNotes(): Note[]{
    return notes
}

function getNextId(){
    return nextNodeId
}

function subscribeToNotesChanges(callback: NewNoteCallback){
    return cbs.push(callback) - 1
}

function unsubscribeToNotrsChanges(subIdx: number) {
    delete cbs[subIdx]
    //todo: handle undefined (problem because other will get thei idxs based on the array before the undefined removal)
}
export {setNotes, addNote,
    removeNote, getNotes,
    subscribeToNotesChanges, unsubscribeToNotrsChanges,
    getNextId, 
    initService}