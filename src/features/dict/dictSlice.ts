import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppDispatch, RootState } from '@/store'
import { loadJsonFromAssets } from '@/utils/utilsJson'
import { DictInfo } from './dict_info'

export interface WordItem {
  name: string
  trans: string[]
  notation: string
  ukphone: string
  usphone: string
}

interface DictState {
  dictCollection: DictInfo[] //DictInfo[]
  words: { [dictId: string]: WordItem[] } // 每个词典有自己的单词列表
  selectedDictId: string | null
  wordCollections: WordItem[]
}

const initialState: DictState = {
  dictCollection: [], //['cet4'],
  words: {},
  selectedDictId: null,
  wordCollections: [],
}

export const dictSlice = createSlice({
  name: 'dict',
  initialState,
  reducers: {
    resetState: (state, action: PayloadAction<any>) => {
      state.dictCollection = []
      state.words = {}
      state.selectedDictId = null
      state.wordCollections = []
    },
    setSelectedDictId: (state, action: PayloadAction<string>) => {
      state.selectedDictId = action.payload
      AsyncStorage.setItem('selectedDictId', state.selectedDictId)
      console.log('setSelectedDictId', state.selectedDictId)
    },
    setDictCollection: (state, action: PayloadAction<DictInfo>) => {
      if (state.dictCollection.some(item => item.id === action.payload.id)) return
      state.dictCollection.push(action.payload)
      AsyncStorage.setItem('dictCollection', JSON.stringify(state.dictCollection))
    },
    toggleWordCollections: (state, action: PayloadAction<WordItem>) => {
      if (state.wordCollections.some(item => item.name === action.payload.name)) {
        state.wordCollections = state.wordCollections.filter(
          item => item.name !== action.payload.name,
        )
      } else {
        state.wordCollections.push(action.payload)
      }
    },
    setWordsForDict: (state, action: PayloadAction<{ dictId: string; words: WordItem[] }>) => {
      const { dictId, words } = action.payload
      state.words[dictId] = words
    },
  },
})

export const {
  setDictCollection,
  setWordsForDict,
  setSelectedDictId,
  toggleWordCollections,
  resetState,
} = dictSlice.actions

export const loadSelectedDict = async (dispatch: AppDispatch) => {
  try {
    const selectedDictId = await AsyncStorage.getItem('selectedDictId')
    if (selectedDictId) {
      const jsonValue = await AsyncStorage.getItem(`words_${selectedDictId}`)
      const existingWords: WordItem[] = jsonValue ? JSON.parse(jsonValue) : []
      dispatch(setSelectedDictId(selectedDictId))
      dispatch(setWordsForDict({ dictId: selectedDictId, words: existingWords }))
    }
  } catch (error) {
    console.error('Error loading dictCollection:', error)
  }
}

export const loadDictCollection = async (dispatch: AppDispatch) => {
  try {
    const jsonValue = await AsyncStorage.getItem('dictCollection')
    if (jsonValue) {
      const collection = JSON.parse(jsonValue)
      dispatch(setDictCollection(collection))
    }
  } catch (error) {
    console.error('Error loading dictCollection:', error)
  }
}
export const clearAllStorage = async (dispatch: AppDispatch) => {
  try {
    await AsyncStorage.clear()
    dispatch(resetState(null))
  } catch (error) {
    console.error('Error loading dictCollection:', error)
  }
}

export const insertJsonToDictCollection = (dictInfo: DictInfo) => async (dispatch: AppDispatch) => {
  const jsonFile = dictInfo.url
  try {
    // 检查词典是否存在于存储中
    const jsonValue = await AsyncStorage.getItem(`words_${dictInfo.id}`)
    const existingWords: WordItem[] = jsonValue ? JSON.parse(jsonValue) : []

    // 解析 JSON 文件
    const wordItems: WordItem[] = await loadJsonFromAssets(jsonFile)

    // 插入新单词
    const newWords = wordItems.filter(
      wordItem => !existingWords.some(existingWord => existingWord.name === wordItem.name),
    )

    const updatedWords = [...existingWords, ...newWords].filter(Boolean)

    // 保存到 AsyncStorage 中
    await AsyncStorage.setItem(`words_${dictInfo.id}`, JSON.stringify(updatedWords))

    // 更新状态
    dispatch(setWordsForDict({ dictId: dictInfo.id, words: updatedWords }))
    dispatch(setDictCollection(dictInfo))
  } catch (error) {
    console.error('Error inserting JSON words:', error)
  }
}

export const selectDictCollection = (state: RootState) => state.dict.dictCollection
export const selectWordsForDict = (dictId: string) => (state: RootState) =>
  state.dict.words[dictId] || []

export const isArchivedWord = (word: WordItem) => (state: RootState) => {
  return state.dict.wordCollections.some(item => item.name === word.name)
}

export default dictSlice.reducer
