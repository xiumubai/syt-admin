import { Outlet } from "react-router-dom";
import { Layout, Button } from "antd";

import withAuthorization from "@/components/withAuthorization";
import Avatar from "../Avatar";
import Breadcrumb from "../Breadcrumb";
import SideBar from "../SideBar";
import Tabs from "../Tabs";

import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectLang, setLang } from "@/app/appSlice";

import "./index.less";

const { Header, Content, Footer } = Layout;

function LayoutComponent() {
  const lang = useAppSelector(selectLang);
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  const handleChangeLang = () => {
    const newLang = lang === "zh_CN" ? "en_US" : "zh_CN";
    dispatch(setLang(newLang));
    i18n.changeLanguage(newLang);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideBar />
      <Layout>
        <Header className="layout-header">
          <Breadcrumb />
          <div>
            <Button size="small" onClick={handleChangeLang}>
              {lang === "zh_CN" ? "English" : "中文"}
            </Button>
            <Avatar />
          </div>
        </Header>
        <Tabs />
        <Content>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
					尚硅谷IT教育-React实战中台管理项目
				</Footer>
      </Layout>
    </Layout>
  );
}

export default withAuthorization(LayoutComponent);
