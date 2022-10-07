// src/routes/index.tsx
import React, { lazy, Suspense } from "react";
import type {FC} from 'react'
import { useRoutes, Navigate } from "react-router-dom";
import { HomeOutlined, ShopOutlined, DatabaseOutlined } from "@ant-design/icons";
import type { SRoutes } from "./types";

import {
  Layout,
  EmptyLayout,
  // CompLayout
} from "../layouts";
import Loading from "@comps/Loading";

import Translation from "@comps/Translation";

const Login = lazy(() => import("@pages/login"));
const Dashboard = lazy(() => import("@pages/dashboard"));
const NotFound = lazy(() => import("@pages/404"));

// 对路由组件进行懒加载
const HospitalSet = lazy(() => import("@/pages/hospital/hospitalSet"));
const HospitalList = lazy(() => import("@/pages/hospital/hospitalList"));
const AddOrUpdateHospital = lazy(() => import("@/pages/hospital/hospitalSet/components/AddOrUpdateHospital"));
const HospitalShow = lazy(() => import("@pages/hospital/hospitalList/HospitalShow"));
const HospitalSchedule = lazy(() => import("@pages/hospital/hospitalList/HospitalSchedule"));
const Dict = lazy(() => import("@pages/cmn/dict"));

const load = (Comp: FC) => {
  return (
    // 因为路由懒加载，组件需要一段网络请求时间才能加载并渲染
    // 在组件还未渲染时，fallback就生效，来渲染一个加载进度条效果
    // 当组件渲染完成时，fallback就失效了
    <Suspense fallback={<Loading />}>
      {/* 所有lazy的组件必须包裹Suspense组件，才能实现功能 */}
      <Comp />
    </Suspense>
  );
};

const routes: SRoutes = [
  {
    path: "/",
    element: <EmptyLayout />,
    children: [
      {
        path: "login",
        element: load(Login),
      },
    ],
  },
  {
    path: "/syt",
    element: <Layout />,
    children: [
      // 首页路由
      {
        path: "/syt/dashboard",
        meta: { 
          icon: <HomeOutlined />, 
          title: <Translation>route:dashboard</Translation> 
        },
        element: load(Dashboard),
      },

      // 医院管理的路由
      /* 
      path: 路由路径
      meta: 用来指定菜单图标和标题的对象
        icon: 图标
        title: 标题
      element: 指定路由组件标签 // 如果有子路由就不需要
        使用load函数来指定
      children: 子路由的数组
      */
      {
        path: "/syt/hospital",
        meta: { 
          icon: <ShopOutlined />, 
          title: '医院管理'
        },
        // element: load(Dashboard),
        children: [
          {
            // path: 'hospitalList',  // 注册路由简写是可以, 但是导航Menu需要完整路径, 简写不可以
            path: '/syt/hospital/hospitalset', // 得用完整写法
            meta: {
              title: '医院设置'
            },
            element: load(HospitalSet)
          },

          {
            path: '/syt/hospital/hospitalset/add',
            meta: {
              title: '添加医院'
            },
            hidden: true, // 不在导航菜单中显示
            element: load(AddOrUpdateHospital)
          },

          {
            path: '/syt/hospital/hospitalset/edit/:id',  // 指定param参数占位
            meta: {
              title: '修改医院'
            },
            hidden: true, // 不在导航菜单中显示
            element: load(AddOrUpdateHospital)
          },

          {
            path: '/syt/hospital/hospitallist',
            meta: {
              title: '医院列表'
            },
            element: load(HospitalList),
          },
          {
            path: "/syt/hospital/hospitallist/show/:id",
            meta: { title: "查看医院详情" },
            element: load(HospitalShow),
            hidden: true,
          },
          {
            path: "/syt/hospital/hospitallist/schedule/:hoscode",  // 要携带的是医院的编号
            meta: { title: "查看医院排班" },
            element: load(HospitalSchedule),
            hidden: true,
          },
        ]
      },

      // 数据管理
      {
        path: "/syt/cmn",
        meta: { 
          icon: <DatabaseOutlined/>,
          title: '数据管理' 
        },
        children: [
          {
            path: '/syt/cmn/dict',
            meta: { 
              title: '数据字典'
            },
            element: load(Dict)
          }
        ]
      },
    ],
  },

  {
    path: "/404",
    element: load(NotFound),
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];

/* 
自定义hook: 注册应用的所有路由
*/
export const useAppRoutes = () => {
  return useRoutes(routes);
};

// 找到要渲染成左侧菜单的路由
export const findSideBarRoutes = () => {
  const currentIndex = routes.findIndex((route) => route.path === "/syt");
  return routes[currentIndex].children as SRoutes;
};

export default routes;
