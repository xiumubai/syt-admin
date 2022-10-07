import { Link } from "react-router-dom";
import { Menu, Dropdown, Button } from "antd";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logoutAsync, selectUser } from "@pages/login/slice";

import "./index.less";

function AvatarComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLogout =  () => {
    // 分发退出登陆的异步action
    dispatch(logoutAsync());
    // 如果成功了, 跳转到登陆页面
    // if (action.type==='user/logoutAsync/fulfilled') {
    //   navigator("/login");
    // }
  };

  const { t } = useTranslation("app");

  const menu = (
    <Menu
      items={[
        { 
          label: <Link to="/syt/dashboard">{t("goHomeBtnText")}</Link>, 
          key: '1' 
        }, // 菜单项务必填写 key
        { 
          label: <div onClick={handleLogout}>{t("logoutBtnText")}</div>, 
          key: '2' 
        },
      ]}
    >
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button className="layout-dropdown-link" type="link">
        <img className="layout-avatar" src={user.avatar} alt="avatar" />
      </Button>
    </Dropdown>
  );
}

export default AvatarComponent;
