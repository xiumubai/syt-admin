import { useNavigate } from 'react-router-dom'
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getUserInfoAsync } from "./pages/login/slice";
import { selectUserRouters } from './app/appSlice';


export const useGetUserInfoByToken = () => {
  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(getUserInfoAsync);
  }, [])
}