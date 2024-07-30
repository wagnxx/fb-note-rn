import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  // DocumentData,
  // FirestoreError,
  query,
  where,
  getDocs,
  doc,
  // type WhereFilterOp,
  QueryConstraint,
  writeBatch,
  FirebaseFirestoreTypes,
  QueryFieldFilterConstraint,
} from '@react-native-firebase/firestore'
import { db } from './firebase'
export { db }
export type DocumentData = FirebaseFirestoreTypes.DocumentData
export type WhereFilterOp = FirebaseFirestoreTypes.WhereFilterOp
export type DocumentSnapshot = FirebaseFirestoreTypes.DocumentSnapshot

const dealError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('Firestore error:', error.message)
  } else {
    console.error('Unknown error:', error)
  }
}

const LogError = console.error.bind(console)
const LogInfo = console.log.bind(console)

export const batchUpdateDocData = async (
  colName: string,
  docIds: string[],
  docDatas: DocumentData[],
) => {
  if (docIds.length !== docDatas.length) {
    throw new Error('The number of docIds must match the number of docDatas.')
  }
  const batch = writeBatch(db)
  docIds.forEach((docId, index) => {
    // doc(db, colName, docId)
    const docRef = doc(db, colName, docId)
    const docData = docDatas[index]
    batch.update(docRef, docData)
  })

  try {
    await batch.commit()
    console.log('Batch update successful!')
    return true
  } catch (error) {
    console.error('Error performing batch update: ', error)
    return null
  }
}

// 添加文档到指定集合
export const addDocToCol = async (
  colName: string,
  docData: DocumentData,
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, colName), docData)
    LogInfo('Document added with ID:', docRef.id)
    return docRef.id // 返回添加文档的 ID
  } catch (error: unknown) {
    dealError(error)
    return null // 返回 null 或者抛出错误，视情况而定
  }
}

// 获取指定文档的数据
export const getDocData = async <T>(
  colName: string,
  docId: string,
): Promise<(DocumentData & T) | null> => {
  try {
    const docSnap: DocumentSnapshot = await getDoc(doc(db, colName, docId))
    if (docSnap.exists) {
      return (docSnap.data() as DocumentData & T) || null
    } else {
      LogError('Document not found')
      return null
    }
  } catch (error: unknown) {
    dealError(error)
    return null // 返回 null 或者抛出错误，视情况而定
  }
}

// 更新指定文档的数据
export const updateDocData = async (
  colName: string,
  docId: string,
  newData: Partial<DocumentData>,
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, colName, docId), newData)
    LogInfo('Document updated successfully')
    return true
  } catch (error: unknown) {
    dealError(error)
    return false
  }
}

// 删除指定文档
export const deleteDocById = async (
  colName: string,
  docId: string,
): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, colName, docId))
    LogInfo('Document deleted successfully')
    return true
  } catch (error: unknown) {
    dealError(error)
  }
  return false
}

export const deleteDocsByIds = async (
  colName: string,
  docIds: string[],
): Promise<boolean> => {
  const batch = writeBatch(db)

  docIds.forEach(id => {
    const docRef = doc(db, colName, id)
    batch.delete(docRef)
  })

  try {
    await batch.commit()
    console.log('Batch delete successful')
    return true
  } catch (error) {
    console.error('Error performing batch delete:', error)
  }
  return false
}

// 获取满足条件的文档集合

export const getDocsByCondition = async (
  colName: string,
  condition: { field: string; operator: WhereFilterOp; value: any },
): Promise<DocumentData[]> => {
  try {
    const q = query(
      collection(db, colName),
      where(condition.field, condition.operator, condition.value),
    )
    const querySnapshot = await getDocs(q)
    const docsData: DocumentData[] = []
    querySnapshot.forEach(doc => {
      docsData.push(doc.data())
    })
    return docsData
  } catch (error: unknown) {
    dealError(error)
    return [] // 返回 null 或者抛出错误，视情况而定
  }
}

// 获取指定字段的值
export const getFieldValues = async <T>(
  collectionName: string,
  fieldNames: (keyof T | 'id')[],
  conditions: (QueryConstraint | QueryFieldFilterConstraint)[] = [],
): Promise<(DocumentData & T)[]> => {
  try {
    // 构建查询
    const q = query(collection(db, collectionName), ...conditions)

    // 获取文档快照
    const querySnapshot = await getDocs(q)

    // 提取字段值
    const fieldValues: (DocumentData & T)[] = []

    querySnapshot.forEach(doc => {
      const fieldValue = {} as DocumentData & T
      fieldNames.forEach(fieldName => {
        if (fieldName === 'id') {
          fieldValue[fieldName] = doc.id
        } else {
          // fieldValue[fieldName] = doc.data()[fieldName]
          ;(fieldValue as DocumentData & { [K in keyof T]: T[K] })[fieldName] =
            doc.data()[fieldName as string]
        }
      })
      fieldValues.push(fieldValue)
    })

    return fieldValues
  } catch (error) {
    console.error('Error getting documents:', error)
    return []
  }
}
