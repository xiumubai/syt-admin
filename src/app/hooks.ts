import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// 当前应用的useDispatch函数
export const useAppDispatch: () => AppDispatch = useDispatch
// 当前应用的useSelector函数
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
