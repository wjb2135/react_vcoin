import React, { Component } from 'react'

export default class NotFound extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div>
        <span>这是404页面</span>
      </div>
    );
  }
}