import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import enUS from "antd/lib/locale/en_US";

import { useAppSelector } from "@/app/hooks";
import { selectLang } from "@/app/appSlice";

import { useAppRoutes } from "./router";

function App() {
  const lang = useAppSelector(selectLang);

  return <ConfigProvider locale={lang === "zh_CN" ? zhCN : enUS}>{useAppRoutes()}</ConfigProvider>;
}

export default App;
