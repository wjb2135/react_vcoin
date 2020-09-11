import React, { Component } from 'react';
import { Menu } from "antd";
import Icon from "@ant-design/icons";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import $ from "jquery";
import Routers from "@configs/routerMap__uc";
import { getCookie } from '@/assets/js/cookieHandle';
import "@styles/layoutSideMain.less";

const { SubMenu } = Menu;

export default class UserCenter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: getCookie('_TOKEN')
    }
  }
  handleClick = e => {
    console.log('click ', e);
  }
  componentDidMount() {
    let self = this;
    self.getMainH();
    window.addEventListener("reset", () => {
      self.getMainH();
    });

    var topNav = document.getElementById("layout_side");
    window.onscroll = function () {
      // 获取滚动条滚动过的距离
      var scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;

      // 当滚动到<指定位置>时给#topNav添加fixed类
      if (scrollTop >= 102) {
        // 给元素添加类:ele.className = 'xx';
        topNav.className = "layout-side fixed";
      } else {
        topNav.className = "layout-side";
      }
    };
  }
  getMainH() {
    let win_h = $(window).height()
    let header_h = $('.app-header').height()
    let footer_h = $('.app-footer').height()
    let side_h = win_h - 102
    let main_h = win_h - 102 - footer_h
    $('.layout-side').css({ 'height': win_h + 'px' })
    $('.layout-side-main').css({ 'minHeight': side_h + 'px' })
    $('.layout-main').css({ 'minHeight': side_h + 'px' })
  }
  render() {
    const { token } = this.state;
    console.log('token');
    console.log(token);

    const { location, match } = this.props;
    console.log(this.props);
    let defaultSelectedKeys = [];
    let defaultOpenKeys = [];
    let selectedKeys = {
      'security': ['/uc/security'],
      'account': ['/uc/account'],
      'assets': ['/uc/assets'],
      'authenticate': ['/uc/authenticate'],
      'lockStore': ['/uc/lockstore'],
      'extension': ['/uc/extension'],
      'invitation_code': ['/uc/invitation_code'],
      'device_manage': ['/uc/device_manage']
    }
    let openKeys = {
      'securityCenter': ['/uc/security', '/uc/account', '/uc/authenticate'],
      'orderCenter': ['/tctrade/orders/order', 'tctrade/orders/advertisement']
    }
    for (const key in selectedKeys) {
      if (selectedKeys.hasOwnProperty(key)) {
        selectedKeys[key].includes(location.pathname) && defaultSelectedKeys.push(key)
      }
    }
    for (const key in openKeys) {
      if (openKeys.hasOwnProperty(key)) {
        openKeys[key].includes(location.pathname) && defaultOpenKeys.push(key)
      }
    }

    return (
      <div className="layout-side-main user-center">
        <div className="layout-side" id="layout_side">
          <Menu
            theme="dark"
            onClick={this.handleClick}
            style={{ width: 256 }}
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            mode="inline"
          >
            <SubMenu
              key="securityCenter"
              title={
                <span>
                  <Icon type="mail" />
                  <span>安全中心</span>
                </span>
              }
            >
              <Menu.Item key="security">
                <Link to="/uc/security">安全设置</Link>
              </Menu.Item>
              <Menu.Item key="account">
                <Link to="/uc/account">账户设置</Link>
              </Menu.Item>
              <Menu.Item key="authenticate">
                <Link to="/uc/authenticate">实名认证</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="assets">
              <Link to="/uc/assets">我的资产</Link>
            </Menu.Item>
            <Menu.Item key="lockStore">
              <Link to="/uc/lockstore">我的锁仓币</Link>
            </Menu.Item>
            <Menu.Item key="extension">
              <Link to="/uc/extension">推广记录</Link>
            </Menu.Item>
            <Menu.Item key="invitation_code">
              <Link to="/uc/invitation_code">邀请码</Link>
            </Menu.Item>
            <Menu.Item key="device_manage">
              <Link to="/uc/device_manage">设备管理</Link>
            </Menu.Item>
          </Menu>
        </div>
        <div className="layout-main">
          <Switch>
            {Routers.map((item, index) => {
              return (
                <Route
                  key={index}
                  path={item.path}
                  exact
                  render={props =>
                    !item.auth ? (
                      <item.component {...props} />
                    ) : token ? (
                      <item.component {...props} />
                    ) : (
                          <Redirect
                            to={{
                              pathname: "/login",
                              state: { from: props.location }
                            }}
                          />
                        )
                  }
                />
              );
            })}
          </Switch>
        </div>
      </div>
    );
  }
}