
import { useRoutes,  } from "react-router-dom";

import type { SRoutes } from "./types";

import cloneDeep from 'lodash/cloneDeep'


import { allAsyncRoutes, anyRoute, constantRoutes } from "./routes";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/pages/login/slice";
import { filterRouter } from "./effect";

const allRoutes = cloneDeep(allAsyncRoutes);
/* 
自定义hook: 注册应用的所有路由
*/
export const useAppRoutes = () => {
  const {routes} = useAppSelector(selectUser);
  const resultRouter = routes?.length ? filterRouter({
    allAsyncRoutes: allRoutes,
    routes: routes 
  }) : constantRoutes
  return useRoutes([...resultRouter, ...anyRoute]);
};

// 找到要渲染成左侧菜单的路由
export const findSideBarRoutes = () => {
  const currentIndex = allRoutes.findIndex((route) => route.path === "/syt");
  return allRoutes[currentIndex].children as SRoutes;
};

export default allAsyncRoutes;
