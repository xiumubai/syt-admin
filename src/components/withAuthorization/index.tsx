import { FC } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Spin } from "antd";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getUserInfoAsync, selectUser } from "@/pages/login/slice";
/*
  高阶组件HOC
    本质上是一个函数，接受组件作为参数，返回一个新组件
  WrappedComponent 组件是哪个？
    看路由路径（地址）
      /login --> EmptyLayout/Login
      /syt/dashboard --> Layout/Dashboard
*/
function withAuthorization(WrappedComponent: FC) { // FunctionComponent
  return () => {
    /* 
    =>是否有token?
      有 (登陆过) =>是否访问登陆页?
          是, 自动跳转到首页
          否, =>是否有name?
              有, 直接显示目标界面
              没有, 请求获取用户信息, 再显示目标界面
      没有 (没有登陆过) =>是否访问登陆页?
          是, 直接显示目标界面
          否, 跳转去登陆界面
    */
    
    // 读取redux中管理的token和用户名   ==> 只要状态数据发生了改变, 当前组件函数就会自动重新执行
    const { token, name } = useAppSelector(selectUser);
    
    // 获取当前请求的路由地址
    const { pathname } = useLocation();
    
    // 如果有token, 说明至少登录过
    if (token) {
      // 如果要去的是登陆页面或根路径路由, 自动访问首页
      if (pathname === "/login" || pathname === "/") {
        return <Navigate to="/syt/dashboard" />;
      }

      // 访问的某个管理页面
      // 如果有用户名, 说明已经登陆, 直接渲染目标组件 LayoutComponent/xxx组件
      if (name) {
        return <WrappedComponent />;
      }

      // 还没有登陆, 分发请求获取用户信息的异步action
      const dispatch = useAppDispatch();
      dispatch(getUserInfoAsync());

      // 在请求过程中, 先显示loading效果 
        // 一旦后面请求成功, 更新redux中用户的name/avatar状态数据, 
        // 当前组件会再将渲染, 由于token和name都有了, 就会渲染目标组件界面
      return <Spin size="large" />;
    } else { // 没有登录过 => 都得去登陆页面
      // 如果访问的是登陆页面, 直接显示对应的组件
      if (pathname === "/login") {
        return <WrappedComponent />;
      }
      // 如果访问不是登录页面, 自动跳转到登陆页面
      return <Navigate to="/login" />;
    }
  };
}

export default withAuthorization;
