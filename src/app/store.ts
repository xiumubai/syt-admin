import { userReducer } from "@/pages/login/slice";
import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "./appSlice";

// 配置reducer, 生成store
const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
  },
});

// 默认暴露store
export default store

// 暴露dispatch的类型
export type AppDispatch = typeof store.dispatch;

// 暴露根state的类型
export type RootState = ReturnType<typeof store.getState>;
