export interface Note {
    id: number
    text: string
  }

export type NewNoteCallback = (notes: Note[], newNoteId: number) => void