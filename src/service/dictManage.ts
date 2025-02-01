import {
  addDocToCol,
  batchAddOrUpdateDocs,
  deleteDocsByIds,
  getDocData,
  getDocSize,
  getFieldValues,
} from '@/firebase/db'

import { auth } from '@/firebase/auth'
import { FieldValue, QueryConstraint, serverTimestamp, where } from 'firebase/firestore'

// import { AffixType } from '@/pages/dict/components/AffixList'
// import { WordRootType } from '@/pages/dict/components/WordRootManage'

export type WordRootType = {
  id?: string
  key: number
  root: string[]
  meaning: string
  wordCount: number
  inDocument: boolean
  inJson: boolean
  isLinked: boolean
}

export type AffixType = {
  id?: string // 唯一标识符，必选
  key: number // 排序用的数字，必选
  type: 'prefix' | 'suffix' // 词缀类型，必选
  affix: string[] // 词缀数组，必选
  meaning: string // 词缀的含义，必选
  affectedPartsOfSpeech?: string[] // 影响的词性，选填
  examples?: string[] // 示例单词，选填
  origin?: string // 词缀的起源，选填
  variants?: string[] // 词缀的变体形式，选填
  commonCombinations?: string[] // 常见组合，选填
  grammarRules?: string // 语法规则，选填
  additionalInfo?: string // 其他附加信息，选填

  initialIndex?: number
}

const COL_WORD_ROOT = 'wordRoot'
const COL_WORD_AFFIX = 'wordAffix'

export type AffixDocType = AffixType & {
  createTime: FieldValue // 创建时间，必选
  updatedTime: FieldValue // 更新时间，必选
  createId?: string
}

type RootDocType = WordRootType & {
  createTime?: FieldValue
  createId?: string
}

export const addWordRoot = (doc: RootDocType) => {
  if (auth?.currentUser?.uid) {
    doc.createTime = serverTimestamp()
    doc.createId = auth.currentUser.uid
    return addDocToCol(COL_WORD_ROOT, doc)
  }
  return Promise.reject('logout')
}
export const getWordRootRow = async (texts: string[]) => {
  if (!auth?.currentUser?.uid) {
    return Promise.reject('logout')
  }

  return getFieldValues(COL_WORD_ROOT, 'all', [where('affix', 'array-contains-any', texts)])
}

export const batchUpdateWordRoot = (docs: Partial<RootDocType>[]) => {
  if (auth?.currentUser?.uid) {
    docs.map(doc => {
      doc.createTime = serverTimestamp()
      doc.createId = auth.currentUser!.uid
    })
    return batchAddOrUpdateDocs(
      COL_WORD_ROOT,
      docs.map(doc => ({ data: doc, id: doc?.id })),
    )
  }
  return Promise.reject('logout')
}

export const getWordRoots = async ({
  pageSize,
  pageNumber,
  // lastVisibleDocData,
}: {
  pageSize: number
  pageNumber: number
  // lastVisibleDocData?: WordRootType
}) => {
  if (!auth?.currentUser?.uid) {
    return Promise.reject('logout')
  }

  console.log('pagesize,pageNuber , ', pageSize, pageNumber)

  const offset = (pageNumber - 1) * pageSize

  const total = await getDocSize(COL_WORD_ROOT)

  const conditions = [
    // orderBy('key', 'asc'),
    // startAfter(offset),
    // limit(pageSize),
  ].filter(Boolean)

  const data = await getFieldValues(COL_WORD_ROOT, 'all', conditions)

  return {
    total: total,
    data,
  }
}

export const getWordRoot = (id: string) => getDocData(COL_WORD_ROOT, id)

export const deleteWordRoot = (ids: string[]) => deleteDocsByIds(COL_WORD_ROOT, ids)

export const batchUpdateWordAffix = (docs: Partial<AffixDocType>[]) => {
  if (auth?.currentUser?.uid) {
    docs.map(doc => {
      if (doc.id) {
        doc.updatedTime = serverTimestamp()
      } else {
        doc.createTime = serverTimestamp()
        doc.createId = auth.currentUser!.uid
      }
    })
    return batchAddOrUpdateDocs(
      COL_WORD_AFFIX,
      docs.map(doc => ({ data: doc, id: doc?.id })),
    )
  }
  return Promise.reject('logout')
}
export const deleteWordAffix = (ids: string[]) => deleteDocsByIds(COL_WORD_AFFIX, ids)

export const getWordAffix = async () => {
  if (!auth?.currentUser?.uid) {
    return Promise.reject('logout')
  }

  const conditions = [
    // where('createId', '==', auth.currentUser.uid),
    // orderBy('key', 'asc'),
    // orderBy('key', 'asc'),
    // lastVisibleDocData ? startAfter(lastVisibleDocData.key) : null,
    // where('docName', '>', ''),
    // orderBy('createTime', 'desc'),
  ].filter(Boolean)

  const data = await getFieldValues(COL_WORD_AFFIX, 'all', conditions as QueryConstraint[])

  return data
}

export const getWordAffixRow = async (texts: string[]) => {
  if (!auth?.currentUser?.uid) {
    return Promise.reject('logout')
  }

  return getFieldValues(COL_WORD_AFFIX, 'all', [where('affix', 'array-contains-any', texts)])
}
