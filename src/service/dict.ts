import { addDocToCol, getFieldValues, updateDocData } from '@/firebase/db'
import { auth } from '@/firebase/auth'
import { FieldValue, where } from '@react-native-firebase/firestore'
import { WordItem } from '@/features/dict/dictSlice'

export const COL_ARTICLES = 'wordsCollections'

export type WordsCol = {
  id?: string // id 是自动给生成
  uid: string
  archived: WordItem[]
  removed: WordItem[]
}

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
}

export const createPersonWordsCol = (doc: Partial<WordsCol>) => {
  if (auth?.currentUser?.uid) {
    doc.uid = auth.currentUser.uid
    return addDocToCol(COL_ARTICLES, doc)
  }
  return Promise.reject('logout')
}

export const updateWordsCol = async (doc: Partial<WordsCol>): Promise<boolean | null> => {
  if (auth?.currentUser?.uid) {
    doc.uid = auth.currentUser.uid
    return updateDocData(COL_ARTICLES, doc.id!, doc)
  }
  return Promise.reject('logout')
}

export const getCurrentUserWordsCol = () => {
  if (auth?.currentUser?.uid) {
    return getFieldValues<WordsCol>(
      COL_ARTICLES,
      ['id', 'uid', 'archived', 'removed'],
      [where('uid', '==', auth.currentUser.uid)],
    )
  }
  return Promise.reject('logout')
}
