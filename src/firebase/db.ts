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
  getCountFromServer,
  QueryFieldFilterConstraint,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  QueryStartAtConstraint,
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
export const deleteDocById = async (colName: string, docId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, colName, docId))
    LogInfo('Document deleted successfully')
    return true
  } catch (error: unknown) {
    dealError(error)
  }
  return false
}

export const deleteDocsByIds = async (colName: string, docIds: string[]): Promise<boolean> => {
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

export const getDocsByCondition = async <
  T extends QueryOrderByConstraint | QueryStartAtConstraint | QueryLimitConstraint,
>(
  colName: string,
  // condition: { field: string; operator: WhereFilterOp; value: any },
  condition: T | T[],
): Promise<DocumentData[]> => {
  try {
    const conditions = Array.isArray(condition) ? condition : [condition]
    const q = query(collection(db, colName), ...conditions)
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
export const getFieldValues = async <T extends DocumentData = DocumentData>(
  collectionName: string,
  fieldNames: string[] | 'all',
  conditions: (QueryConstraint | QueryFieldFilterConstraint)[] = [],
): Promise<T[]> => {
  try {
    // 构建查询
    const q = query(collection(db, collectionName), ...conditions)

    // 获取文档快照
    const querySnapshot = await getDocs(q)

    // 提取字段值
    const fieldValues: T[] = []

    querySnapshot.forEach(docS => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let fieldValue: Record<string, any> = {} // 使用 Record 来允许任意字段赋值

      // 获取所有字段
      if (fieldNames === 'all') {
        const docData = docS.data()
        if (docData) {
          fieldValue = { ...docData, id: docS.id } // 合并 id 和数据
        }
      } else {
        // 获取指定字段
        fieldNames.forEach((fieldName: string) => {
          if (fieldName === 'id') {
            fieldValue[fieldName] = docS.id // 直接修改 id
          } else {
            const docData = docS.data()
            if (docData) {
              fieldValue[fieldName] = docData[fieldName] // 获取特定字段
            }
          }
        })
      }

      // 确保 fieldValue 类型正确
      fieldValues.push(fieldValue as T) // 使用类型断言
    })

    return fieldValues
  } catch (error) {
    console.error('Error getting documents:', error)
    return []
  }
}

export const batchAddOrUpdateDocs = async (
  colName: string,
  docs: { id?: string; data: DocumentData }[],
): Promise<string[] | null> => {
  const batch = writeBatch(db)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docRefs: any[] = [] // 用于存储文档的引用，以便稍后提取其 ID

  docs.forEach(d => {
    let docRef
    if (d.id) {
      // 如果传递了 id，使用 update 更新文档
      docRef = doc(collection(db, colName), d.id)
      batch.update(docRef, d.data) // 批量更新文档
    } else {
      // 如果没有 id，使用 set 添加新文档
      docRef = doc(collection(db, colName)) // 自动生成 ID
      batch.set(docRef, d.data) // 批量添加文档
    }
    docRefs.push(docRef) // 将每个文档的引用加入 docRefs 数组
  })

  try {
    // 提交批量操作
    await batch.commit()

    // 提取所有文档的 ID
    const docIds = docRefs.map(ref => ref.id)

    console.log('Batch add successful')
    return docIds
  } catch (error: unknown) {
    dealError(error)
    return null // 返回 null 或者抛出错误，视情况而定
  }
}

export const getDocSize = async (colName: string): Promise<number> => {
  try {
    // 获取集合的文档数量
    const snapshot = await getCountFromServer(collection(db, colName))

    // 获取总数
    const total = snapshot.data().count

    console.log('Total number of documents:', total)
    return total
  } catch (error) {
    console.error('Error getting document count:', error)
    // 如果发生异常，返回一个默认值或抛出错误
    throw new Error('无法获取文档数量')
  }
}
// 检查字段值是否对应某条数据存在
export const checkDataExistsByFieldValue = async (
  colName: string, // 集合名称
  fieldName: string, // 字段名称
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any, // 字段值
): Promise<boolean> => {
  try {
    // 构建查询条件
    const q = query(collection(db, colName), where(fieldName, '==', value))

    // 执行查询
    const querySnapshot = await getDocs(q)

    // 如果查询到文档，表示该字段值对应的数据存在
    if (!querySnapshot.empty) {
      console.log(`Data with '${fieldName}' = '${value}' exists in collection '${colName}'`)
      return true
    } else {
      console.log(`Data with '${fieldName}' = '${value}' does not exist in collection '${colName}'`)
      return false
    }
  } catch (error: unknown) {
    dealError(error)
    return false
  }
}
