import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="找不到页面"
      extra={
        <Button type="primary" onClick={() => navigate("/syt/dashboard")}>
          返回首页
        </Button>
      }
    />
  );
}

export default NotFound;
