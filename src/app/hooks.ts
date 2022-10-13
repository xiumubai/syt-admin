import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// 当前应用的useDispatch函数
export const useAppDispatch: () => AppDispatch = useDispatch
// 当前应用的useSelector函数
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 获取href参数
export const useSearch: any = () => {
  const [params, setParams] = useState()
  
  useEffect(() => {
    const getParameters = (URL: string) => JSON.parse(`{"${decodeURI(URL.split("?")[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`
    )
    setParams(getParameters(window.location.href))
  }, [])
  return params || {};
}
