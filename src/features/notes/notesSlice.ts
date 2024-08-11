// src/features/notes/notesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NotesState, Folder, Note, ICurrentFolder } from './types'
import { AppThunk } from '@/store'
import { getFolders } from '@/service/basic'
import { db } from '@/firebase/firebase'
import { COL_ARTICLES } from '@/service/articles'
import { extractTextFromHTML } from '@/utils/utilsString'
import { getCurrentFolderFromStorage } from '@/utils/utilsStorage'

const initialState: NotesState = {
  allNotesList: [],
  publishedNotesList: [],
  folders: [],
  currentFolder: { id: '', name: 'ALL Folders' },
  noteLoading: false,
  error: null,
}

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.allNotesList = action.payload
    },
    setPublishedNotes: (state, action: PayloadAction<Note[]>) => {
      state.publishedNotesList = action.payload
    },
    setFolders: (state, action: PayloadAction<Folder[]>) => {
      state.folders = action.payload
    },
    setCurrentFolder: (state, action: PayloadAction<ICurrentFolder>) => {
      state.currentFolder = action.payload
    },
    setNoteLoading: (state, action: PayloadAction<boolean>) => {
      state.noteLoading = action.payload
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload
    },
  },
  extraReducers: builder => {},
})

export const {
  setNotes,
  setPublishedNotes,
  setFolders,
  setCurrentFolder,
  setNoteLoading,
  setError,
} = notesSlice.actions
export default notesSlice.reducer

export const fetchNotes = (): AppThunk => async (dispatch, getState) => {
  const { user } = getState().auth
  console.log('user', user)
  if (!user?.uid) return

  db.collection(COL_ARTICLES)
    .where('createId', '==', user.uid)
    .onSnapshot(
      querySnapshot => {
        const notesList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          folderId: doc.data().folderId || '',
          titleText: extractTextFromHTML(doc.data().title),
        }))
        console.log('notesList', notesList)
        dispatch(setNotes(notesList))
      },
      error => {
        console.error(error)
        dispatch(setError(error))
      },
    )
}
// export const getAllPublishedNotes = () => {
//   return getFieldValues(
//     COL_ARTICLES,
//     ['title', 'id', 'createTime', 'createId'],
//     [
//       where('title', '>', ''),
//       // where('content', '>', ''),
//       where('published', '==', true),
//       orderBy('title', 'asc'),
//       // orderBy('content', 'asc'),
//       orderBy('createTime', 'asc'),
//     ],
//   )
// }

export const refreshFolders = (): AppThunk => async (dispatch, getState) => {
  const { allNotesList } = getState().notes
  const res = await getFolders()
  if (res?.length) {
    const data = res.map(item => {
      const curItemFolderId = item.id
      const count =
        allNotesList?.filter(note => note?.folderId === curItemFolderId)
          .length || 0
      item.noteCount = count
      return item
    })
    dispatch(setFolders(data))
  } else {
    dispatch(setFolders([]))
  }
}

export const fetchCurrentFolder = (): AppThunk => async dispatch => {
  const data = await getCurrentFolderFromStorage({
    id: '',
    name: 'ALL Folders',
  })
  dispatch(setCurrentFolder(data))
}

export const findNotesByKeyword =
  (keyword: string): AppThunk =>
  (dispatch, getState) => {
    const { allNotesList, currentFolder } = getState().note

    return allNotesList.filter(note => {
      if (!note.titleText && !note.content) return false
      const k = keyword.toLocaleLowerCase()
      const title = note.titleText?.toLocaleLowerCase()
      const content = note.content?.toLocaleLowerCase()
      return title?.includes(k) || content.includes(k)
    })
  }
