import type {Note, NewNoteCallback} from '../types'
import {setNotes as setNotesToStorage, setLastNoteId as setLastNoteIdToStorage, getLastNoteId as getLastNoteIdFromStorge, getNotes as getNotesFromStorage} from './saveNotesLocalStorage'

let notes: Note[] = []
const cbs: NewNoteCallback[] = []
let nextNodeId: number

function initService(){
    console.log('init');
    nextNodeId = getLastNoteIdFromStorge() + 1
    notes = getNotesFromStorage() || []
    cbs.forEach(cb => cb(notes, nextNodeId))
}

function setNotes(newNotes: Note[]){
    
    notes = [...newNotes]
    //todo: find lastId
    const currentLastNoteId = notes[notes.length - 1].id
    nextNodeId = currentLastNoteId + 1
    cbs.forEach(cb => cb(notes, nextNodeId))
}

function addNote(note: Note){
    console.log(`new note: ${note}`);
    
    //local
    notes.push(note)
    nextNodeId = note.id + 1
    
    //storage
    setNotesToStorage(notes)
    setLastNoteIdToStorage(note.id)
    
    //bubble the change
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
    cbs.push(callback)
}
export {setNotes, addNote, removeNote, getNotes, subscribeToNotesChanges, getNextId, initService}