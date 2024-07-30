import React, { useCallback, useMemo } from 'react'
import { Folder, getFolders } from '@/service/basic'
import { createContext, useContext, useEffect, useState } from 'react'
import { COL_ARTICLES, getAllNotes, Note } from '@/service/articles'
import { extractTextFromHTML } from '@/utils/utilsString'
import {
  getCurrentFolderFromStorage,
  ICurrentFolder,
} from '@/utils/utilsStorage'
import { db } from '@/firebase/firebase'
import { useAuth } from './auth-provider'

interface NoteContextType {
  folders: Folder[]
  refreshFolders: () => void
  refreshNote: () => void
  noteList: Partial<Note>[]
  noteLoading: boolean
  currentFolder: ICurrentFolder
  setCurrentFolder: React.Dispatch<React.SetStateAction<ICurrentFolder>>
  noteLength: number
}

export const NoteContext = createContext<NoteContextType>({
  folders: [],
  refreshFolders: () => {},
  refreshNote: () => {},
  noteList: [],
  noteLoading: true,
  currentFolder: null,
  setCurrentFolder: () => {},
  noteLength: 0,
})

// Create the NoteProvider component
export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [folders, setFolders] = useState<Folder[]>([])
  const [noteList, setNoteList] = useState<Partial<Note>[]>([])
  const [noteLoading, setNoteLoading] = useState(false)
  const [currentFolder, setCurrentFolder] = useState<ICurrentFolder>(null)

  const [allNotesList, setAllNotesList] = useState([])
  const [error, setError] = useState(null)

  const { user } = useAuth()

  const noteLength = useMemo(() => allNotesList.length, [allNotesList])

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = db
      .collection(COL_ARTICLES)
      .where('createId', '==', user.uid)
      .onSnapshot(
        querySnapshot => {
          const notesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            folderId: doc.data().folderId || '',
            // ...doc.data(),
          }))
          // console.log('notesList:::', notesList)
          setAllNotesList(notesList)
        },
        error => {
          console.error(error)
          setError(error)
        },
      )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [user])

  const refreshFolders = useCallback(() => {
    getFolders().then(res => {
      if (res?.length) {
        const data = res.map(item => {
          const curItemFolderId = item.id
          const count =
            allNotesList?.filter(item => {
              return item?.folderId === curItemFolderId
            }).length || 0
          item.noteCount = count
          return item
        })
        setFolders(data)
        return
      }
      setFolders([])
    })
  }, [allNotesList])

  const refreshNote = useCallback(() => {
    if (!currentFolder) return currentFolder
    setNoteLoading(true)
    getAllNotes(currentFolder?.id)
      .then(data => {
        data?.forEach(item => {
          item.titleText = extractTextFromHTML(item.title)
        })
        // console.log('get current folder notes::', data)
        setNoteList(data)
      })
      .catch(err => {
        console.log('\x1b[31m%s\x1b[0m', 'get all note err:::', err)
      })
      .finally(() => {
        setNoteLoading(false)
      })
  }, [currentFolder])

  const init = useCallback(() => {
    refreshFolders()
    refreshNote()
  }, [refreshFolders, refreshNote])

  useEffect(() => {
    getCurrentFolderFromStorage({ id: '', name: 'ALL Folders' }).then(data => {
      if (data) {
        setCurrentFolder(data)
      }
    })
  }, [setCurrentFolder])

  useEffect(() => {
    // const unsubscribe = () => {}

    init()

    // return unsubscribe
  }, [init])

  const values = {
    folders,
    refreshFolders,
    noteList,
    noteLoading,
    currentFolder,
    refreshNote,
    setCurrentFolder,
    noteLength,
  }

  return <NoteContext.Provider value={values}>{children}</NoteContext.Provider>
}

// Custom hook to use the AuthContext
export const useNote = (): NoteContextType => useContext(NoteContext)
