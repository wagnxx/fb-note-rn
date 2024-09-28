import { RootState } from '@/store'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadSelectedDict } from './dictSlice'

export const useDict = () => {
  const selectedDictId = useSelector((state: RootState) => state.dict.selectedDictId)
  const dictCollection = useSelector((state: RootState) => state.dict.dictCollection)
  const wordsMap = useSelector((state: RootState) => state.dict.words)
  const wordCollections = useSelector((state: RootState) => state.dict.wordCollections)
  const removedWords = useSelector((state: RootState) => state.dict.removedWords)

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
    wordCollections,
    removedWords,
    dictCollection,
    currentDictInfo,
  }
}
