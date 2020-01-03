import React, { Component } from 'react';
import { Menu, Icon } from "antd";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import $ from "jquery";
import Routers from "@configs/routerMap__tctrade";
import { getCookie } from '@/assets/js/cookieHandle';
import TcTradeBuy from "./trade/buy";
import TcTradeSell from "./trade/sell";
import "@styles/layoutSideMain.less";

const { SubMenu } = Menu;

export default class TradeIndex extends Component {
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
    window.onscroll = function() {
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
  getMainH () {
    let win_h = $(window).height()
    let header_h = $('.app-header').height()
    let footer_h = $('.app-footer').height()
    let side_h = win_h - 102
    let main_h = win_h - 102 - footer_h
    $('.layout-side').css({'height': win_h + 'px'})
    $('.layout-side-main').css({'minHeight': side_h + 'px'})
    $('.layout-main').css({'minHeight': side_h + 'px'})
  }
  render() {
    const token = getCookie('_TOKEN')
    const { location, match } = this.props;
    console.log(this.props);
    let defaultSelectedKeys = [];
    let defaultOpenKeys = [];
    let selectedKeys = {
      'buy': '/tctrade/trade/buy',
      'sell': '/tctrade/trade/sell',
      'order': '/tctrade/orders/order',
      'ad': '/tctrade/orders/advertisement',
      'ident': '/tctrade/ident',
    }
    let openKeys = {
      'tradeCenter': ['/tctrade/trade/buy', '/tctrade/trade/sell'],
      'orderCenter': ['/tctrade/orders/order', 'tctrade/orders/advertisement']
    }
    for (const key in selectedKeys) {
      if (selectedKeys.hasOwnProperty(key)) {
        (selectedKeys[key] == location.pathname) && defaultSelectedKeys.push(key)
      }
    }
    for (const key in openKeys) {
      if (openKeys.hasOwnProperty(key)) {
        openKeys[key].includes(location.pathname) && defaultOpenKeys.push(key)
      }
    }

    return (
      <div className="layout-side-main">
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
              key="tradeCenter"
              title={
                <span>
                  <Icon type="mail" />
                  <span>交易中心</span>
                </span>
              }
            >
              <Menu.Item key="buy">
                <Link to="/tctrade/trade/buy">我要买入</Link>
              </Menu.Item>
              <Menu.Item key="sell">
                <Link to="/tctrade/trade/sell">我要卖出</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="orderCenter"
              title={
                <span>
                  <Icon type="appstore" />
                  <span>订单中心</span>
                </span>
              }
            >
              <Menu.Item key="order">
                <Link to="/tctrade/orders/order">我的订单</Link>
              </Menu.Item>
              <Menu.Item key="ad">
                <Link to="/tctrade/orders/advertisement">我的广告</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="ident">
              <Link to="/tctrade/ident">商家认证</Link>
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