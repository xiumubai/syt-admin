import { useEffect } from "react"
import { useAppDispatch } from "./app/hooks";
import { getUserInfoAsync } from "./pages/login/slice";

export const useGetUserInfoByToken = () => {
  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(getUserInfoAsync);
  }, [])
}
