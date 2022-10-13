
import { useRoutes,  } from "react-router-dom";

import type { SRoutes } from "./types";


import { allAsyncRoutes, constantRoutes } from "./routes";
import { useAppSelector } from "@/app/hooks";
import { selectUserRouters } from "@/app/appSlice";
import { filterRouter } from "./effect";


/* 
自定义hook: 注册应用的所有路由
*/
export const useAppRoutes = () => {
  const allRouter = useAppSelector(selectUserRouters);
  const resultRouter = allRouter?.length ? filterRouter({
    allAsyncRoutes: allAsyncRoutes,
    routes: allRouter 
  }) : constantRoutes
  return useRoutes(resultRouter);
};

// 找到要渲染成左侧菜单的路由
export const findSideBarRoutes = () => {
  const currentIndex = allAsyncRoutes.findIndex((route) => route.path === "/syt");
  return allAsyncRoutes[currentIndex].children as SRoutes;
};

export default allAsyncRoutes;
