import React from 'react';
import { Link } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import Icon from "@ant-design/icons";
import "@styles/Login.less";

function Login(props) {
  const { isLogining } = props;
  // const { getFieldDecorator } = props.form; // 3.x版本弃用
  // const handleSubmit = function(e) {
  //   e.preventDefault();
  //   props.handleSubmit(props.form);
  // }
  const onFinish = (values) => {
    console.log("Success:", values);
    props.handleSubmit(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="page-login">
      <div className="register-wrap">
        <h2>欢迎登陆</h2>
        <Form
          className="login-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="account"
            rules={[{ required: true, message: "请输入登陆账号" }]}
          >
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="手机 / 邮箱 / 用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              autoComplete="off"
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Link className="login-form-forgot" to="/forget">
              忘记密码？
            </Link>
            <Button
              type="primary"
              loading={isLogining}
              htmlType="submit"
              className="login-form-button"
            >
              登陆
            </Button>
          </Form.Item>
        </Form>
        <div>
          <p>还没有账号？</p>
          <p>立即注册，在全球领先的数字资产交易平台开始交易。</p>
          <Link to="/register">免费注册</Link>
        </div>
      </div>
    </div>
  );
}

// const UILogin = Form.create({ name: "normal_login" })(Login);
export default Login;