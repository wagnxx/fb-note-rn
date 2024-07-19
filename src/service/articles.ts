import { DocumentData, addDocToCol, deleteDocsByIds, getDocData, getFieldValues } from '@/firebase/db'
import { auth } from '@/firebase/auth'
import { FieldValue, orderBy, serverTimestamp, where } from '@react-native-firebase/firestore'

const COL_ARTICLES = 'articles'

export type Note = {
  title: string
  content: string
  tags?: string[]
  published?: boolean // if draft ? false : true
  createTime?: FieldValue
  createId?: string
}

export const createNote = (doc: Note) => {
  doc.createTime = serverTimestamp()
  if (auth?.currentUser?.uid) {
    doc.createId = auth.currentUser.uid
    return addDocToCol(COL_ARTICLES, doc)
  }
  return Promise.reject('logout')
}

export const getAllNotes: () => Promise<DocumentData & Partial<Note>[]> = () => {
  if (!auth?.currentUser?.uid) {
    return Promise.reject('logout')
  }
  return getFieldValues<Partial<Note>>(
    COL_ARTICLES,
    ['title', 'id', 'createTime', 'published'],
    [
      where('createId', '==', auth.currentUser.uid),
      // where('published', 'in', [status === true ? true ? status === false ? false : ...[true , false] ]),
      // where('tags', 'not-in', ['']),
      // where('content', '>', ''),
      where('title', '>', ''),
      orderBy('title', 'desc'),
      orderBy('createTime', 'desc'),
    ],
  )
}

export const getNote = (id: string) => getDocData<Note>(COL_ARTICLES, id)

export const getAllPublishedNotes = () => {
  return getFieldValues(
    COL_ARTICLES,
    ['title', 'id', 'createTime', 'createId'],
    [
      where('title', '>', ''),
      // where('content', '>', ''),
      where('published', '==', true),
      orderBy('title', 'asc'),
      // orderBy('content', 'asc'),
      orderBy('createTime', 'asc'),
    ],
  )
}

export const deleteNotes = (ids: string[]) => deleteDocsByIds(COL_ARTICLES, ids)
