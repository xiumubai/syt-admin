

/* 
axios二次封装
1. 基础路径和超时时间 => create方法
2. 请求自动携带token => 请求拦截器
3. 请求操作成功返回响应体json中的data属性数据 => 响应拦截器的成功回调
4. 请求失败或请求操作失败, 统一错误提示 => 响应拦截器的成功和失败回调
*/

import store from "@/app/store";
import { message } from "antd";
import axios from "axios";

// 创建一个功能与axios类似贩函数
// 发ajax请求
// 1. 基础路径和超时时间 => create方法
const request = axios.create({
  // baseURL: '/dev-api', // 基础路径 => 用于匹配代理服务器
  /* 
  开发环境: .env.development文件中配置的 REACT_APP_API = '/dev-api'
  生产环境: .env.production文件中配置的 REACT_APP_API = '/prod-api'
  */
  baseURL: process.env.REACT_APP_API, // 基础路径 => 用于匹配代理服务器
  timeout: 15000 // 限定服务器能处理返回的最大时间, 超过就自动取消请求
})

// 添加请求拦截器  => 发请求瓣调用
// 拦截器本质是回调函数 
// config配置: 用于发请求的一些配置   url / method / data / params / headers
request.interceptors.request.use((config) => {
  console.log('请求拦截器', config);
  // 2. 请求自动携带token => 请求拦截器
  // 如果redux中有token, 就通过请求头来携带
  const token = store.getState().user.token
  if (token) {
    (config.headers as any)['token'] = token
  }

  // 必须最后返回config
  return config
})



// 添加响应拦截器 => 请求返回后调用
request.interceptors.response.use(
  response => { // 成功的回调
    console.log('响应拦截器成功的回调', response)
    // 3. 请求操作成功返回响应体json中的data属性数据 => 响应拦截器的成功回调
    if (response.data.code === 200) {
      return response.data.data
    }
    if (response.data.code === 203) {
      // 5. 如果token过期或者没有token，统一跳转到login
      // window.location.href = `${window.location.origin}/login?callback=${window.location.pathname}`;
      return ;
    }
    // 4. 请求操作失败, 统一错误提示 => 响应拦截器的成功回调
    const errorMsg = response.data.data || response.data.message || '请求未知错误'
    message.error(errorMsg)

    // 将错误向下传递 => 传递给具体的请求
    return Promise.reject(new Error(errorMsg))

  },
  // 4. 请求失败, 统一错误提示 => 响应拦截器的失败回调
  error => { // 失败的回调
    console.log('响应拦截器失败的回调', error)

    message.error(error.message || '请求未知错误')
    throw error
    // return Promise.reject(error)
  }
)

// 暴露request
export default request