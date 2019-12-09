import React, { Component } from "react";
import { message, Button } from "antd";

export default class Index extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
      isCertificates: false,
      show: true
    };
  }
  success() {
    message.success("This is a success message");
  }
  render() {
    return (
      <div>
        <Button onClick={this.success}>Success</Button>
      </div>
    );
  }
}