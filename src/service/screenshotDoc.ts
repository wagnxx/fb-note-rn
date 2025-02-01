import {
  addDocToCol,
  batchAddOrUpdateDocs,
  checkDataExistsByFieldValue,
  deleteDocsByIds,
  getDocData,
  getFieldValues,
} from '@/firebase/db'

import { FieldValue, serverTimestamp } from 'firebase/firestore'
// import { ScreenshotDoc } from '@/pages/tools/docSnap/ScreenshotDoc'
import { auth } from '@/firebase/auth'

const COL_SCREENSHOT = 'screenshotDoc'

export type ScreenshotDoc = {
  id?: string
  docName: string
  keyTerms?: string[]
  screenshots: string[]
  createTime?: FieldValue
  order?: number
}

export type ScreenshotDocType = ScreenshotDoc & {
  // docName: string
  // screenshots: Array<string>
  // keyTerms?: Array<string>
  // createTime?: FieldValue | string
  createId?: string
}

export const createScreenshotDoc = (doc: Partial<ScreenshotDocType>) => {
  doc.createTime = serverTimestamp()
  if (auth?.currentUser?.uid) {
    doc.createId = auth.currentUser.uid
    return addDocToCol(COL_SCREENSHOT, doc)
  }
  return Promise.reject('logout')
}

export const batchUpdateScreenshotDoc = (docs: Partial<ScreenshotDocType>[]) => {
  if (auth?.currentUser?.uid) {
    docs.map(doc => {
      doc.createTime = serverTimestamp()
      doc.createId = auth.currentUser!.uid

      if (!doc.id) {
        delete doc.id
      }
    })

    return batchAddOrUpdateDocs(
      COL_SCREENSHOT,
      docs.map(doc => ({ data: doc, id: doc?.id })),
    )
  }
  return Promise.reject('logout')
}

export const getAllScreenshotDoc = () => {
  if (!auth?.currentUser?.uid) {
    return Promise.reject('logout')
  }
  return getFieldValues<ScreenshotDocType>(
    COL_SCREENSHOT,
    // ['docName', 'id', 'createTime', 'keyTerms', 'screenshots'],
    'all',
    [
      // where('createId', '==', auth.currentUser.uid),
      // where('docName', '>', ''),
      // orderBy('createTime', 'desc'),
    ],
  )
}
export const checkScreenshotDocExistsByName = (name: string) => {
  if (!auth?.currentUser?.uid) {
    return Promise.reject('logout')
  }
  return checkDataExistsByFieldValue(COL_SCREENSHOT, 'docName', name)
}

export const getScreenshotDoc = (id: string) => getDocData(COL_SCREENSHOT, id)

export const deleteScreenshotDocs = (ids: string[]) => deleteDocsByIds(COL_SCREENSHOT, ids)
