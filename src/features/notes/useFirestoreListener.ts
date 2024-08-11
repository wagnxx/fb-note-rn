// useFirestoreListener.ts
import { db, WhereFilterOp } from '@/firebase/db'
import { useEffect, useRef, useState } from 'react'

interface FirestoreListenerProps {
  collection: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where?: [string, WhereFilterOp, any]
}
const useFirestoreListener = ({
  collection,
  where,
}: FirestoreListenerProps) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    let query = db.collection(collection)
    if (where) {
      query = query.where(...where)
    }

    // 清理上一个监听器
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
    }

    // 设置新的监听器
    const unsubscribe = query.onSnapshot(
      snapshot => {
        const newData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setData(newData)
        setLoading(false)
      },
      error => {
        setError(error.message)
        setLoading(false)
      },
    )

    unsubscribeRef.current = unsubscribe

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 根据依赖项重新设置监听器

  return { data, loading, error }
}

export default useFirestoreListener
