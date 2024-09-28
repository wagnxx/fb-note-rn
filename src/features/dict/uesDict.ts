import { RootState } from '@/store'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadSelectedDict } from './dictSlice'

export const useDict = () => {
  const selectedDictId = useSelector((state: RootState) => state.dict.selectedDictId)
  const dictCollection = useSelector((state: RootState) => state.dict.dictCollection)
  const wordsMap = useSelector((state: RootState) => state.dict.words)
  const wordCollections = useSelector((state: RootState) => state.dict.wordCollections)

  const dispatch = useDispatch()

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
    dictCollection,
  }
}
