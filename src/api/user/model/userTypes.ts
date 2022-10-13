// 请求获取用户信息的响应数据类型
export interface ReqGetUserInfoResponse {
  name: string;
  avatar: string;
  routes?: string[];
  buttons?: string[];
}

// 请求登陆的响应数据类型
export interface ReqLoginResponse {
  token: string
}