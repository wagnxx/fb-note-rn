import { RootState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectAllNotesList = (state: RootState) => state.notes.allNotesList
export const selectCurrentFolder = (state: RootState) =>
  state.notes.currentFolder

export const selectNotes = createSelector(
  [selectAllNotesList, selectCurrentFolder],
  (allNotesList, currentFolder) => {
    if (!currentFolder) return allNotesList
    return allNotesList.filter(note => note.folderId === currentFolder.id)
  },
)
