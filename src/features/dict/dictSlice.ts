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
  wordsCollection: WordItem[]
  wordsRemoved: WordItem[]
  wordsCollectionInitial: WordItem[]
  wordsRemovedInitial: WordItem[]
  wordsDocId: string | null
}

const initialState: DictState = {
  dictCollection: [],
  words: {},
  selectedDictId: null,
  wordsCollection: [],
  wordsRemoved: [],
  wordsCollectionInitial: [],
  wordsRemovedInitial: [],
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
      state.wordsCollection = []
      state.wordsRemoved = []
      AsyncStorage.clear() // Clear storage on reset
    },
    setSelectedDictId: (state, action: PayloadAction<string>) => {
      state.selectedDictId = action.payload
      AsyncStorage.setItem('selectedDictId', JSON.stringify(action.payload))
      console.log('setSelectedDictId', JSON.stringify(action.payload))
    },
    addDictCollection: (state, action: PayloadAction<DictInfo>) => {
      if (!state.dictCollection.some(item => item.id === action.payload.id)) {
        state.dictCollection = [...state.dictCollection, action.payload]
      } else {
        // state.dictCollection = state.dictCollection.filter(item => item.id !== action.payload.id)
      }
      AsyncStorage.setItem('dictCollection', JSON.stringify(state.dictCollection))
    },
    toggleWordCollections: (state, action: PayloadAction<WordItem>) => {
      // console.log('toggleWordCollections action:', action)
      const existingItem = state.wordsCollection.find(item => item.name === action.payload.name)
      // console.log('action.payload.isIn ::', action.payload.isIn)
      if (existingItem) {
        state.wordsCollection = state.wordsCollection.filter(
          item => item.name !== action.payload.name,
        )
      } else {
        state.wordsCollection = [...state.wordsCollection, action.payload]
      }
      console.log('after toggleWordCollections', state.wordsCollection)
      AsyncStorage.setItem('wordsCollection', JSON.stringify(state.wordsCollection)) // Persist after toggle
    },
    toggleWordRemoved: (state, action: PayloadAction<WordItem>) => {
      const existingItem = state.wordsRemoved.find(item => item.name === action.payload.name)
      if (existingItem) {
        state.wordsRemoved = state.wordsRemoved.filter(item => item.name !== action.payload.name)
      } else {
        state.wordsRemoved = [...state.wordsRemoved, action.payload]
      }
      AsyncStorage.setItem('wordsRemoved', JSON.stringify(state.wordsRemoved)) // Persist after toggle
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
      state.wordsRemoved = action.payload
      state.wordsRemovedInitial = action.payload
      AsyncStorage.setItem('wordsRemoved', JSON.stringify(state.wordsRemoved)) // Persist after toggle
    },
    setWordCollections: (state, action: PayloadAction<WordItem[]>) => {
      state.wordsCollection = action.payload
      state.wordsCollectionInitial = action.payload
      AsyncStorage.setItem('wordsCollection', JSON.stringify(state.wordsCollection)) // Persist after toggle
    },
  },
})

export const {
  addDictCollection,
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
  console.log('selectedDictId::', selectedDictId)
  if (selectedDictId) {
    const existingWords: WordItem[] = (await loadFromAsyncStorage(`words_${selectedDictId}`)) || []
    dispatch(setSelectedDictId(selectedDictId))
    dispatch(setWordsForDict({ dictId: selectedDictId, words: existingWords }))
  }
}

export const loadDictCollection = (dispatch: AppDispatch) => async () => {
  const collection = await loadFromAsyncStorage('dictCollection')
  console.log('loadDictCollection collection::', collection)
  if (collection) {
    collection.forEach(dict => dispatch(addDictCollection(dict)))
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
    dispatch(addDictCollection(dictInfo))
  } catch (error) {
    console.error('Error inserting JSON words:', error)
  }
}

export const selectDictCollection = (state: RootState) => state.dict.dictCollection
export const selectWordsForDict = (dictId: string) => (state: RootState) =>
  state.dict.words[dictId] || []

export const isArchivedWord = (word: WordItem) => (state: RootState) => {
  return state.dict.wordsCollection.some(item => item.name === word.name)
}

export default dictSlice.reducer
