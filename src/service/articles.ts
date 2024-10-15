import {
  DocumentData,
  addDocToCol,
  batchUpdateDocData,
  getDocData,
  getFieldValues,
  updateDocData,
} from '@/firebase/db'
import { auth } from '@/firebase/auth'
import {
  FieldValue,
  orderBy,
  QueryFieldFilterConstraint,
  serverTimestamp,
  where,
} from '@react-native-firebase/firestore'
import { DocType } from '@/screens/note/create'

export const COL_ARTICLES = 'articles'

export type Note = {
  id?: string // id 是自动给生成
  title: string
  content: string
  tags?: string[]
  folderId?: string
  published?: boolean // if draft ? false : true
  createTime?: FieldValue
  createId?: string
  titleText?: string
  contentText?: string
  docType?: DocType

  isDeleted?: boolean
  deletedAt?: FieldValue
}

export const createNote = (doc: Note) => {
  doc.createTime = serverTimestamp()
  if (auth?.currentUser?.uid) {
    doc.createId = auth.currentUser.uid
    return addDocToCol(COL_ARTICLES, doc)
  }
  return Promise.reject('logout')
}

export const updateNote = async (doc: Partial<Note>): Promise<boolean | null> => {
  if (auth?.currentUser?.uid) {
    doc.createId = auth.currentUser.uid
    return updateDocData(COL_ARTICLES, doc.id!, doc)
  }
  return Promise.reject('logout')
}

export const deleteNotes = (ids: string[]) => {
  const docs = ids.map(item => ({ id: item, isDeleted: true, delatedAt: serverTimestamp() }))
  return batchUpdateNote(ids, docs)
}

export const restoreNotes = (ids: string[]) => {
  const docs = ids.map(item => ({ id: item, isDeleted: false }))
  return batchUpdateNote(ids, docs)
}

export const getRecentRemovedNotes: () => Promise<DocumentData & Partial<Note>[]> = () => {
  if (!auth?.currentUser?.uid) {
    return Promise.reject('logout')
  }
  const conditions: QueryFieldFilterConstraint[] = [
    where('createId', '==', auth.currentUser.uid),
    where('isDeleted', '==', true),
    // orderBy('deletedAt', 'desc'),
  ].filter((condition): condition is QueryFieldFilterConstraint => condition !== null) // 过滤掉 null 或 undefined

  return getFieldValues<Partial<Note>>(
    COL_ARTICLES,
    ['title', 'id', 'createTime', 'deletedAt', 'published'],
    conditions,
  )
}

export const batchUpdateNote = async (
  noteIds: string[],
  docs: Partial<Note>[],
): Promise<boolean | null> => {
  if (auth?.currentUser?.uid) {
    docs?.forEach(item => (item.createId = auth.currentUser?.uid))
    return batchUpdateDocData(COL_ARTICLES, noteIds, docs)
  }
  return Promise.reject('logout')
}

export const getAllNotes: (folderId?: string) => Promise<DocumentData & Partial<Note>[]> = (
  folderId?: string,
) => {
  if (!auth?.currentUser?.uid) {
    return Promise.reject('logout')
  }
  const conditions: QueryFieldFilterConstraint[] = [
    where('createId', '==', auth.currentUser.uid),
    // where('published', 'in', [status === true ? true ? status === false ? false : ...[true , false] ]),
    // where('tags', 'not-in', ['']),
    // where('content', '>', ''),
    folderId ? where('folderId', '==', folderId) : null,
    where('title', '>', ''),
    orderBy('title', 'desc'),
    orderBy('createTime', 'desc'),
  ].filter((condition): condition is QueryFieldFilterConstraint => condition !== null) // 过滤掉 null 或 undefined

  return getFieldValues<Partial<Note>>(
    COL_ARTICLES,
    ['title', 'id', 'createTime', 'published'],
    conditions,
  )
}

export const getNote = (id: string) => getDocData<Note>(COL_ARTICLES, id)

export const getAllPublishedNotes = () => {
  return getFieldValues(
    COL_ARTICLES,
    ['title', 'id', 'createTime', 'createId'],
    [
      where('isDeleted', 'in', [false, null]),
      where('title', '>', ''),
      where('published', '==', true),
      orderBy('title', 'asc'),
      // orderBy('content', 'asc'),
      orderBy('createTime', 'asc'),
    ],
  )
}

// export const deleteNotes = (ids: string[]) => deleteDocsByIds(COL_ARTICLES, ids)
