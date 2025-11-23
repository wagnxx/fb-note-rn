// store.js
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import persistedReducer from './rootReducer'
import { persistStore } from 'redux-persist'

const store = configureStore({
  reducer: persistedReducer,

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // 禁用序列化检查
    }).concat([]),
})
const persistor = persistStore(store) // 创建持久化对象

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
export { store, persistor }
export default store
