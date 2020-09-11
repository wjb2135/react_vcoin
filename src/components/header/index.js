import React, { Component } from 'react'
import { connect } from "react-redux";
import { Menu, Dropdown, Popover } from "antd";
import Icon from "@ant-design/icons";
import { withRouter, NavLink, Link } from "react-router-dom";
import {
  sagaGetBaseUserInfoAction,
  sagaLoginOutAction
} from "@/store/actionCreators";

import "@styles/header.less";

var QRCode = require("qrcode.react")

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "fabi"
    };
    this.loginOut = this.loginOut.bind(this)
  }
  componentDidMount() {
    this.props.getBaseUserInfo()
  }
  handleClick = e => {
    this.setState({
      current: e.key
    });
  };
  loginOut() {
    this.props.loginOutAction()
  }
  render() {
    console.log(123456);
    
    const { loginUser, sysConfig, match, location } = this.props;
    let menu, balanceMenu;
    if (loginUser && loginUser.id) {
      menu = (
        <Menu>
          <Menu.Item>
            <Link to="/">安全设置</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/">账户设置</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/">实名认证</Link>
          </Menu.Item>
          <Menu.Item onClick={this.loginOut}>
            <Link to="/">退出登陆</Link>
          </Menu.Item>
        </Menu>
      );
      balanceMenu = (
        <Menu>
          <Menu.Item>
            <Link to="/">我的资产</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/">充币</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/">提现</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/">充值提现记录</Link>
          </Menu.Item>
        </Menu>
      );
    }
    const qrcodeContent = (
      <div className="qrcode-box">
        <div className="qrcode-l">
          <QRCode value={(sysConfig && sysConfig.app_down_url && sysConfig.app_down_url.android_down_url) || ''} />
          <p>
            <Icon type="mobile" />
            <span>&nbsp;扫码上方二维码</span>
          </p>
        </div>
      </div>
    );

    let selectedKeys = [];
    let selectedKeysArr = {
      'home': ['/', '/home'],
      'fabi': ['/tctrade/', '/tctrade/trade/buy', '/tctrade/trade/sell', '/tctrade/orders/order', '/tctrade/orders/advertisement', '/tctrade/ident'],
      'uc': ['/uc/security', '/uc/account', '/uc/authenticate', '/uc/assets', '/uc/lockstore', '/uc/extension', '/uc/invitation_code', '/uc/device_manage']
    }
    
    for (const key in selectedKeysArr) {
      if (selectedKeysArr.hasOwnProperty(key)) {
        selectedKeysArr[key].includes(location.pathname) && selectedKeys.push(key)
      }
    }

    return (
      <div className="app-header">
        <div className="logo">
          <img src={this.props.sysConfig.site_logo} alt="" />
        </div>
        <Menu
          onClick={this.handleClick}
          selectedKeys={selectedKeys}
          mode="horizontal"
          className="nav"
        >
          <Menu.Item key="home">
            <NavLink to="/" activeClassName="selected">
              首页
            </NavLink>
          </Menu.Item>
          <Menu.Item key="fabi">
            <NavLink to="/tctrade/" activeClassName="selected">
              法币交易
            </NavLink>
          </Menu.Item>
          <Menu.Item key="bibi">币币交易</Menu.Item>
          <Menu.Item key="margin">杠杠交易</Menu.Item>
          <Menu.Item key="future">合约交易</Menu.Item>
          <Menu.Item key="uc">
            <NavLink to="/uc/security" activeClassName="selected">
              用户中心
            </NavLink>
          </Menu.Item>
        </Menu>
        <div className="login">
          {loginUser && loginUser.id ? (
            <Dropdown overlay={menu} placement="bottomRight">
              <span>
                {loginUser.nickname ||
                  loginUser.mobile ||
                  loginUser.email ||
                  loginUser.username}
              </span>
            </Dropdown>
          ) : (
            <>
              <NavLink
                to="/login"
                activeClassName="selected"
                className="login-item"
              >
                登陆
              </NavLink>
              <NavLink
                to="/register"
                activeClassName="selected"
                className="login-item"
              >
                注册
              </NavLink>
            </>
          )}
        </div>
        <div className="app-download">
          <Popover placement="bottom" content={qrcodeContent}>
            <span className="login-item">
              <Icon type="mobile" />
              下载客户端
            </span>
          </Popover>
        </div>
        {loginUser && loginUser.id && (
          <div className="balance-wrap">
            <Dropdown overlay={balanceMenu} placement="bottomCenter">
              <span>资产管理</span>
            </Dropdown>
          </div>
        )}
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
    },
    loginOutAction() {
      const action = sagaLoginOutAction();
      dispatch(action)
    }
  }
}

export default withRouter(connect(stateToProps, dispatchToProp)(Header))