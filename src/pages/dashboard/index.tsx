import { useTranslation } from "react-i18next";
import { Card } from "antd";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@pages/login/slice";

function Dashboard() {
  const user = useAppSelector(selectUser);
  const { t } = useTranslation(["app"]);

  return (
    <Card style={{ minHeight: "calc(100vh - 64px)" }}>
      <h2>{t("dashboard")}</h2>
      <h2>用户名: {user.name}</h2>
    </Card>
  );
}

export default Dashboard;
