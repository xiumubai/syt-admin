import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* 
管理应用的国际化语言状态数据的redux模块
*/

// 状态数据接口
interface AppState {
  lang: string;
}

// 初始化状态
let initialState: AppState = {
  lang: localStorage.getItem("lang") || "zh_CN"
};

// 创建redux模块
export const appSlice = createSlice({
  name: "app",
  // 初始化状态数据
  initialState,
  // reducer函数 --> 会自动生成同步action函数
  reducers: {
    setLang(state, action) {
      const lang = action.payload;
      localStorage.setItem("lang", lang);
      state.lang = lang;
    },
  },
});

// 暴露同步action
export const { setLang } = appSlice.actions;

// 暴露reducer函数
export const appReducer = appSlice.reducer;

// 暴露用来获取数据的select函数
export const selectLang = (state: RootState) => state.app.lang;
