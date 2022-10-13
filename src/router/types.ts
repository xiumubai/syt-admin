import type { ReactElement } from "react";
import type { RouteObject } from "react-router-dom";

export interface SMeta {
  icon?: ReactElement;
  title?: string | ReactElement;
}

export interface SRoute extends RouteObject {
  children?: SRoutes;
  
  meta?: SMeta;
  hidden?: boolean;
  name: string;
}

export type SRoutes = SRoute[];


export interface TreeRouterFilterParams {
  routeHash: Record<string, any>;
  allAsyncRoutes: SRoutes;
  lv?: number
}
export interface TreeRouterFilter {
  (params: TreeRouterFilterParams): SRoutes
}
export interface FilterRouterParams{
  allAsyncRoutes: SRoutes,
  routes: string[]
}
export interface FilterRouter {
  (params: FilterRouterParams): SRoutes 
}
