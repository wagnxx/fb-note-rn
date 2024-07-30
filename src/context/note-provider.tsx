import React, { useCallback, useMemo } from 'react'
import { Folder, getFolders } from '@/service/basic'
import { createContext, useContext, useEffect, useState } from 'react'
import { COL_ARTICLES, Note } from '@/service/articles'
import {
  getCurrentFolderFromStorage,
  ICurrentFolder,
} from '@/utils/utilsStorage'
import { db } from '@/firebase/firebase'
import { useAuth } from './auth-provider'
import { extractTextFromHTML } from '@/utils/utilsString'

interface NoteContextType {
  folders: Folder[]
  refreshFolders: () => void
  refreshNote: () => void
  findNotesBykeyword: (k: string) => Note[]
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
  findNotesBykeyword: () => [],
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
  const [allNotesList, setAllNotesList] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolder, setCurrentFolder] = useState<ICurrentFolder>(null)
  const noteLoading = false

  const [error, setError] = useState(null)

  const { user } = useAuth()

  const noteLength = useMemo(() => allNotesList.length, [allNotesList])

  const noteList = useMemo(() => {
    return allNotesList.filter(note => {
      if (!currentFolder?.id) return true
      if (currentFolder.id === note?.folderId) return true
      return false
    })
  }, [allNotesList, currentFolder])

  const findNotesBykeyword = (key: string) => {
    return noteList.filter(note => {
      if (!note.titleText && !note.content) return false
      const k = key.toLocaleLowerCase()
      const title = note.titleText?.toLocaleLowerCase()
      const content = note.content?.toLocaleLowerCase()
      return title?.includes(k) || content.includes(k)
    })
  }

  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = db
      .collection(COL_ARTICLES)
      .where('createId', '==', user.uid)
      .onSnapshot(
        querySnapshot => {
          const notesList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            folderId: doc.data().folderId || '',
            titleText: extractTextFromHTML(doc.data().title),
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
        // console.log('folders:::', data)
        return
      }
      setFolders([])
    })
  }, [allNotesList])

  // allNotesList 已经是响应式数据了，此处没必要执行
  const refreshNote = useCallback(() => {
    // if (!currentFolder) return currentFolder
    // setNoteLoading(true)
    // getAllNotes(currentFolder?.id)
    //   .then(data => {
    //     data?.forEach(item => {
    //       item.titleText = extractTextFromHTML(item.title)
    //     })
    //     // console.log('get current folder notes::', data)
    //     setNoteList(data)
    //   })
    //   .catch(err => {
    //     console.log('\x1b[31m%s\x1b[0m', 'get all note err:::', err)
    //   })
    //   .finally(() => {
    //     setNoteLoading(false)
    //   })
  }, [])

  useEffect(() => {
    getCurrentFolderFromStorage({ id: '', name: 'ALL Folders' }).then(data => {
      setCurrentFolder(data)
    })
  }, [])

  useEffect(() => {
    refreshFolders()
    // return unsubscribe
  }, [refreshFolders])

  const values = {
    folders,
    refreshFolders,
    findNotesBykeyword,
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
