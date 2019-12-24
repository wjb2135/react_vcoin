import React, { Component } from 'react'
import { Menu } from "antd"
import { NavLink } from "react-router-dom";

import "@styles/header.less";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "home",
      sysConfig: ""
    };
  }
  componentDidMount() {
    this.getData();
  }
  async getData() {
    let res = await this.postRequestParam("/api/system/get_config");
    this.setState({
      sysConfig: res.data.data
    });
  }
  handleClick = e => {
    this.setState({
      current: e.key
    });
  };
  render() {
    return (
      <div className="app-header">
        <div className="logo">
          <img src={this.state.sysConfig.site_logo} alt="" />
        </div>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          className="nav"
        >
          <Menu.Item key="home">
            <NavLink
              to="/"
              activeClassName="selected"
            >首页</NavLink>
          </Menu.Item>
          <Menu.Item key="fabi">法币交易</Menu.Item>
          <Menu.Item key="bibi">币币交易</Menu.Item>
          <Menu.Item key="margin">杠杠交易</Menu.Item>
          <Menu.Item key="future">合约交易</Menu.Item>
          <Menu.Item key="uc">用户中心</Menu.Item>
        </Menu>
        <div className="login">
          <NavLink to="/login" activeClassName="selected" className="login-item">登陆</NavLink>
          <NavLink to="/register" activeClassName="selected" className="login-item">注册</NavLink>
        </div>
      </div>
    );
  }
}

export default Header