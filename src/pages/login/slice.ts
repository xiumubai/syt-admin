import { reqGetUserInfo, reqLogin, reqLogout } from "@/api/user";
import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// 登陆参数的类型
export interface LoginParams {
  username: string;
  password: string;
}

// State的类型
interface UserState {
  token: string;
  name: string;
  avatar: string;
  routes?: string[];
  buttons?: string[];
}

// 初始状态
const initialState: UserState = {
  token: localStorage.getItem('token_key') || '',
  name: '',
  avatar: '',
  routes: [],
  buttons: []
}

// 登陆 
export const loginAsync = createAsyncThunk(
  'user/loginAsync',
  ({username, password}: LoginParams) => reqLogin(username, password)
)

// 获取用户信息
export const getUserInfoAsync = createAsyncThunk(
  'user/getUserInfoAsync',
  () => reqGetUserInfo()
)

// 退出
export const logoutAsync = createAsyncThunk(
  'user/LogoutAsync',
  () => reqLogout()
)

// 创建当前redux模块的管理对象slice
const userSlice = createSlice({
  name: 'user', // 标识名称
  initialState, // 初始状态
  // 配置同步action对应的reducer => 同步action会自动生成
  reducers: {},
  // 为前面定义的异步action, 定义对应的reducer
  extraReducers(builder) {
    builder
      // 登陆请求成功后的reducer处理
      .addCase(loginAsync.fulfilled, (state, action) => {
        // 将token保存localStorage / redux
        const token:any = action.payload
        localStorage.setItem('token_key', token)
        state.token = token
      })
      // 获取用户信息请求成功后的reducer处理
      .addCase(getUserInfoAsync.fulfilled, (state, action) => {
        // 将返回的name和avatar只保存到redux
        console.log(action);
        
        const {name, avatar, routes, buttons} = action.payload
        state.name = name
        state.avatar = avatar
        state.routes = routes;
        state.buttons = buttons;
        console.log('state.routes', state.routes)
      })
      // 退出请求成功后的reducer处理
      .addCase(logoutAsync.fulfilled, (state, action) => {
        // 清除state和local中的token
        state.name = ''
        state.avatar = ''
        state.token = ''
        state.routes = []
        state.buttons = []
        localStorage.removeItem('token_key')
      })
  },
})

// 暴露reducer
export const userReducer = userSlice.reducer

// 暴露用于读取当前状态数据的select函数
export const selectUser = (state: RootState) => state.user
