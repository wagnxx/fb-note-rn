import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// 类型安全的 dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

// 类型安全的 selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
