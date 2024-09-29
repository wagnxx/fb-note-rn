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
  dictCollection: DictInfo[]
  words: { [dictId: string]: WordItem[] }
  selectedDictId: string | null
  wordCollections: WordItem[]
  removedWords: WordItem[]
  wordsDocId: string | null
}

const initialState: DictState = {
  dictCollection: [],
  words: {},
  selectedDictId: null,
  wordCollections: [],
  removedWords: [],
  wordsDocId: '',
}

export const dictSlice = createSlice({
  name: 'dict',
  initialState,
  reducers: {
    resetState: state => {
      state.dictCollection = []
      state.words = {}
      state.selectedDictId = null
      state.wordCollections = []
      state.removedWords = []
      AsyncStorage.clear() // Clear storage on reset
    },
    setSelectedDictId: (state, action: PayloadAction<string>) => {
      state.selectedDictId = action.payload
      AsyncStorage.setItem('selectedDictId', action.payload)
      console.log('setSelectedDictId', action.payload)
    },
    setDictCollection: (state, action: PayloadAction<DictInfo>) => {
      if (!state.dictCollection.some(item => item.id === action.payload.id)) {
        state.dictCollection.push(action.payload)
        AsyncStorage.setItem('dictCollection', JSON.stringify(state.dictCollection))
      }
    },
    toggleWordCollections: (state, action: PayloadAction<WordItem>) => {
      const existingItem = state.wordCollections.find(item => item.name === action.payload.name)
      if (existingItem) {
        state.wordCollections = state.wordCollections.filter(
          item => item.name !== action.payload.name,
        )
      } else {
        state.wordCollections.push(action.payload)
      }
      AsyncStorage.setItem('wordCollections', JSON.stringify(state.wordCollections)) // Persist after toggle
    },
    toggleWordRemoved: (state, action: PayloadAction<WordItem>) => {
      const existingItem = state.removedWords.find(item => item.name === action.payload.name)
      if (existingItem) {
        state.removedWords = state.removedWords.filter(item => item.name !== action.payload.name)
      } else {
        state.removedWords.push(action.payload)
      }
      AsyncStorage.setItem('removedWords', JSON.stringify(state.removedWords)) // Persist after toggle
    },
    setWordsForDict: (state, action: PayloadAction<{ dictId: string; words: WordItem[] }>) => {
      const { dictId, words } = action.payload
      state.words[dictId] = words
      AsyncStorage.setItem(`words_${dictId}`, JSON.stringify(words)) // Persist words for the dict
    },
    setWordsDocId: (state, action: PayloadAction<string | null>) => {
      state.wordsDocId = action.payload // Persist words for the dict
    },
    setWordRemoved: (state, action: PayloadAction<WordItem[]>) => {
      state.removedWords = action.payload
      AsyncStorage.setItem('removedWords', JSON.stringify(state.removedWords)) // Persist after toggle
    },
    setWordCollections: (state, action: PayloadAction<WordItem[]>) => {
      state.wordCollections = action.payload
      AsyncStorage.setItem('wordCollections', JSON.stringify(state.wordCollections)) // Persist after toggle
    },
  },
})

export const {
  setDictCollection,
  setWordsForDict,
  setSelectedDictId,
  toggleWordCollections,
  toggleWordRemoved,
  resetState,
  setWordsDocId,
  setWordRemoved,
  setWordCollections,
} = dictSlice.actions

const loadFromAsyncStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error(`Error loading ${key}:`, error)
  }
}

export const loadSelectedDict = (dispatch: AppDispatch) => async () => {
  const selectedDictId = await loadFromAsyncStorage('selectedDictId')
  if (selectedDictId) {
    const existingWords: WordItem[] = (await loadFromAsyncStorage(`words_${selectedDictId}`)) || []
    dispatch(setSelectedDictId(selectedDictId))
    dispatch(setWordsForDict({ dictId: selectedDictId, words: existingWords }))
  }
}

export const loadDictCollection = (dispatch: AppDispatch) => async () => {
  const collection = await loadFromAsyncStorage('dictCollection')
  if (collection) {
    collection.forEach(dict => dispatch(setDictCollection(dict)))
  }
}

export const clearAllStorage = (dispatch: AppDispatch) => async () => {
  try {
    await AsyncStorage.clear()
    dispatch(resetState())
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error)
  }
}

export const insertJsonToDictCollection = (dictInfo: DictInfo) => async (dispatch: AppDispatch) => {
  const jsonFile = dictInfo.url
  try {
    const existingWords: WordItem[] = (await loadFromAsyncStorage(`words_${dictInfo.id}`)) || []
    const wordItems: WordItem[] = await loadJsonFromAssets(jsonFile)

    const newWords = wordItems.filter(
      wordItem => !existingWords.some(existingWord => existingWord.name === wordItem.name),
    )
    const updatedWords = [...existingWords, ...newWords].filter(Boolean)

    await AsyncStorage.setItem(`words_${dictInfo.id}`, JSON.stringify(updatedWords))
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
