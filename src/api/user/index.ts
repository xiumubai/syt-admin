import { request } from "@/utils/http";
import { ReqGetUserInfoResponse, ReqLoginResponse } from "./model/userTypes";

// 登录
export const reqLogin = (username: string, password: string) => {
  return request.post<any, ReqLoginResponse>("/admin/auth/index/login", {
    username,
    password,
  });
};

// 登出
export const reqLogout = () => {
  return request.post<any, null>("/admin/auth/index/logout");
};

// 获取用户信息
export const reqGetUserInfo = () => {
  return request.get<any, ReqGetUserInfoResponse>("/admin/auth/index/info");
};
