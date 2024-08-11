// store.js
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import todosReducer from '@/features/todos/todosSlice'
import notesReducer from '@/features/notes/notesSlice'
import authReducer from '@/features/auth/authSlice'

const store = configureStore({
  reducer: {
    todos: todosReducer,
    notes: notesReducer,
    auth: authReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // 禁用序列化检查
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// 自定义 useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>()
export default store
