import { useState } from "react";
import { Link } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";

import { TabType } from "../../types";

import "./index.less";

interface TabProps {
  tab: TabType;
  active: boolean;
  index: number;
  length: number;
  onClose(index: number): void;
  onCloseOthers(index: number): void;
  onCloseAll(index: number): void;
}

function Tab({ tab, active, index, length, onClose, onCloseOthers, onCloseAll }: TabProps) {
  const handleMenuClick = ({ key }: any) => {
    switch (key) {
      case "close":
        onClose(index);
        return;
      case "closeOthers":
        onCloseOthers(index);
        return;
      case "closeAll":
        onCloseAll(index);
        return;
    }
  };

  const menu = (
    <Menu
      className="context-menu"
      onClick={handleMenuClick}
      items={[
        {
          label: "关闭",
          key: "close",
          disabled: index === 0,
        },
        {
          label: "关闭其他",
          key: "closeOthers",
          disabled: length === 1 || (length === 2 && index !== 0),
        },
        {
          label: "全部关闭",
          key: "closeAll",
          disabled: length <= 1,
        },
      ]}
    />
  );

  const [isHover, setIsHover] = useState(false);

  const handleHover = (isHover: boolean) => {
    return () => {
      setIsHover(isHover);
    };
  };

  return (
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      <div className={`tab ${active ? "active" : ""}`} onMouseEnter={handleHover(true)} onMouseLeave={handleHover(false)}>
        <Link className="tab-link" to={tab.path}>
          {tab.title}
        </Link>
        {tab.closable && (isHover || active) && <CloseOutlined className="tab-close" onClick={() => onClose(index)} />}
      </div>
    </Dropdown>
  );
}

export default Tab;
