import { Form, Input, Button, message } from "antd";
// redux相关
import { useAppDispatch } from "@/app/hooks";
import { loginAsync, LoginParams } from "./slice";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import "./index.less";

function Login() {

  const dispatch = useAppDispatch()


  // 点击提交按钮, 且校验通过后才执行
  const onFinish = async (values: LoginParams) => {
    // 分发请求登陆的异步ation
    const action = await dispatch(loginAsync(values))
    // 登陆请求成功后, 提示登陆成功
    if (action.type==='user/loginAsync/fulfilled') {
      message.success('登陆成功!')
    }

  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>尚医通平台管理系统</h1>
        <Form
          name="basic"
          initialValues={{ username: "admin", password: "111111" }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="" name="username" rules={[{ required: true, message: "请输入用户名!" }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名：admin"/>
          </Form.Item>

          <Form.Item label="" name="password" rules={[{ required: true, message: "请输入用户名密码!" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码：111111" />
          </Form.Item>

          <Form.Item >
            <Button type="primary" htmlType="submit" className="login-btn">
              登录
            </Button>
          </Form.Item>

          <Form.Item>
            其他登陆方式：<a href="www.baidu.com">微信</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
