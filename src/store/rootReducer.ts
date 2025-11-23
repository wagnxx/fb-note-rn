import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

import todosReducer from '@/features/todos/todosSlice'
import notesReducer from '@/features/notes/notesSlice'
import authReducer from '@/features/auth/authSlice'
import dictSliceReducer from '@/features/dict/dictSlice'
import scannerReducer from '@/features/tool/sleces/scannerSlice'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['scanner'], // 只持久化 scanner slice
}

const rootReducer = combineReducers({
  todos: todosReducer,
  notes: notesReducer,
  auth: authReducer,
  dict: dictSliceReducer,
  scanner: scannerReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default persistedReducer
