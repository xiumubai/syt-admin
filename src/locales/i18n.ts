import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en_US from "./lang/en_US";
import zh_CN from "./lang/zh_CN";

import store from "@/app/store";

const resources = {
  zh_CN,
  en_US,
};

i18n.use(initReactI18next).init({
  resources, // 所有语言包
  lng: store.getState().app.lang, // 初始化语言
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
