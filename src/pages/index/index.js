import React, { Component } from "react"
import { message, Button } from "antd"
import Tip from '@components/Tip'
import Counter from "@components/Counter";

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
    const fruit = [
      { id: 1, name: "苹果", price: 5.12 },
      { id: 2, name: "白梨", price: 3.42 },
      { id: 3, name: "香蕉", price: 2.92 }
    ];
    return (
      <div>
        <Tip tipInfo={fruit} initCount="{0}" />
        <Counter />
      </div>
    );
  }
}