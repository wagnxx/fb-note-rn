// src/features/notes/types.ts

export interface Folder {
  id: string
  name: string
  noteCount?: number
}

export interface Note {
  id: string
  titleText?: string
  content?: string
  folderId?: string
  createId?: string
}

export interface ICurrentFolder {
  id: string
  name: string
}

export interface NotesState {
  allNotesList: Note[]
  publishedNotesList: Note[]
  folders: Folder[]
  currentFolder: ICurrentFolder
  noteLoading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
}
