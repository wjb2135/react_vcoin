import React, { Component } from 'react'
import { connect } from "react-redux";
import { Menu } from "antd"
import { NavLink } from "react-router-dom";
import { 
  sagaGetSysConfigAction,
  sagaGetBaseUserInfoAction
} from "@/store/actionCreators"

import "@styles/header.less";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "home"
    };
  }
  componentDidMount() {
    this.props.getBaseUserInfo()
  }
  handleClick = e => {
    this.setState({
      current: e.key
    });
  };
  render() {
    const { loginUser } = this.props
    return (
      <div className="app-header">
        <div className="logo">
          <img src={this.props.sysConfig.site_logo} alt="" />
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
          {
            loginUser.id ? 
            (
              <span>{loginUser.nickname || loginUser.mobile || loginUser.email || loginUser.username}</span>
            )
            :
            (
              <>
                <NavLink to="/login" activeClassName="selected" className="login-item">登陆</NavLink>
                <NavLink to="/register" activeClassName="selected" className="login-item">注册</NavLink>
              </>
            )
          }
        </div>
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    sysConfig: state.systemConfig,
    loginUser: state.baseUserInfo
  }
}
const dispatchToProp = (dispatch) => {
  return {
    getBaseUserInfo() {
      const action = sagaGetBaseUserInfoAction()
      dispatch(action)
    }
  }
}

export default connect(stateToProps, dispatchToProp)(Header)