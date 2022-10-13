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
