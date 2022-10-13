import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useTranslation } from "react-i18next";

import { findSideBarRoutes } from "@/router";
import { SRoutes } from "@/router/types";
import type { MenuProps } from "antd";

import "./index.less";
import logo from "./images/logo.png";

// https://ant.design/components/menu-cn/
type MenuItem = Required<MenuProps>["items"][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: "group"): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const { Sider } = Layout;

interface MenuInfo {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const { pathname } = location;

  useEffect(() => {
    const openKeys = pathname.split("/").slice(0, 3).join("/");
    setOpenKeys([openKeys]);
    const selectedKeys = pathname.split("/").slice(0).join("/");
    setSelectedKeys([selectedKeys]);
  }, [pathname]);

  const routes = findSideBarRoutes() as SRoutes;

  const menuItems: MenuItem[] = routes.map((route) => {
    return getItem(
      route.meta?.title,
      route.path as string,
      route.meta?.icon,
      route.children
        ?.map((item) => {
          if (item.hidden) return null;
          return getItem(item.meta?.title, item.path as string, item.meta?.icon);
        })
        .filter(Boolean)
    );
  });

  const handleMenuClick = ({ key }: MenuInfo) => {
    navigate(key);
  };

  const handleOpenChange = (openKeys: string[]) => {
    setOpenKeys(openKeys);
  };

  const { t } = useTranslation();

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} breakpoint="lg">
      <h1 className="layout-title">
        <img className="layout-logo" src={logo} alt="logo" />
        <span style={{ display: collapsed ? "none" : "inline-block" }}>{t("app:title")}</span>
      </h1>
      <Menu
        theme="dark"
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={handleMenuClick}
        onOpenChange={handleOpenChange}
      ></Menu>
    </Sider>
  );
}

export default SideBar;
