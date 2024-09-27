import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export const useDict = () => {
  const colIds = useSelector((state: RootState) => state.dict.dictCollection)
  const currentWordList = useSelector((state: RootState) => state.dict.words[colIds[0]])
  const wordCollections = useSelector((state: RootState) => state.dict.wordCollections)

  return {
    currentWordList,
    wordsCount: currentWordList?.length || 0,
    wordCollections,
  }
}
