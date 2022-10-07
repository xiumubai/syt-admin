import { ReactElement } from "react";

export interface TabType {
  key: string;
  path: string;
  title: ReactElement | string;
  closable: boolean;
}

export type TabsType = TabType[];
