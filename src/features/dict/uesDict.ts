import { RootState } from '@/store'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadSelectedDict } from './dictSlice'

export const useDict = () => {
  const selectedDictId = useSelector((state: RootState) => state.dict.selectedDictId)
  const dictCollection = useSelector((state: RootState) => state.dict.dictCollection)
  const wordsMap = useSelector((state: RootState) => state.dict.words)
  const wordsCollection = useSelector((state: RootState) => state.dict.wordsCollection)
  const wordsRemoved = useSelector((state: RootState) => state.dict.wordsRemoved)
  const wordsCollectionInitial = useSelector(
    (state: RootState) => state.dict.wordsCollectionInitial,
  )
  const wordsRemovedInitial = useSelector((state: RootState) => state.dict.wordsRemovedInitial)
  const wordsDocId = useSelector((state: RootState) => state.dict.wordsDocId)

  const hasWordsCollectionChanged = useMemo(() => {
    return (
      arraysNotEqualByName(wordsCollection, wordsCollectionInitial) ||
      arraysNotEqualByName(wordsRemoved, wordsRemovedInitial)
    )
  }, [wordsCollection, wordsCollectionInitial, wordsRemoved, wordsRemovedInitial])

  const dispatch = useDispatch()

  const currentDictInfo = useMemo(() => {
    if (selectedDictId) {
      return dictCollection.find(item => item.id === selectedDictId)
    } else {
      return null
    }
  }, [dictCollection, selectedDictId])

  const currentWordList = useMemo(() => {
    if (selectedDictId) {
      return wordsMap[selectedDictId] || []
    } else {
      return []
    }
  }, [selectedDictId, wordsMap])

  useEffect(() => {
    loadSelectedDict(dispatch)
  }, [dispatch])

  return {
    currentWordList,
    wordsCount: currentWordList?.length || 0,
    wordsCollection,
    wordsRemoved,
    dictCollection,
    currentDictInfo,
    hasWordsCollectionChanged,
    wordsDocId,
  }
}

const arraysEqualByName = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false

  const names1 = arr1.map(item => item.name).sort()
  const names2 = arr2.map(item => item.name).sort()

  return names1.every((name, index) => name === names2[index])
}

const arraysNotEqualByName = (arr1, arr2) => {
  // 如果长度不同，则不相等
  if (arr1.length !== arr2.length) return true

  // 创建一个 Set 来存储 arr2 的 name 值
  const namesSet = new Set(arr2.map(item => item.name))

  // 检查 arr1 中是否有任何一个 name 不在 namesSet 中
  return arr1.some(item => !namesSet.has(item.name))
}
