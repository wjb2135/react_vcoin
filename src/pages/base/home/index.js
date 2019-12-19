import React, { Component } from "react";
import { Link } from "react-router-dom";
import Banner from "./inc/Banner";
import MarketTicker from "./inc/MarketTicker";
import IndexAd from "./inc/IndexAd";
import { Layout, Menu, Icon } from "antd";
const { Header, Sider, Content } = Layout;

export default class Home extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.state = {
      sysConfig: {}
    };
  }
  async getSysConfig() {
    let res = await this.postRequestParam('/api/system/get_config')
    console.log("getSysConfig");
    console.log(res.data);
    this.setState({
      sysConfig: res.data.data
    });
  }
  componentDidMount() {
    this.getSysConfig()
  }
  render() {
    const { sysConfig } = this.state
    console.log('sysConfig');
    console.log(this.state.sysConfig);
    
    return (
      <div>
        <Banner />
        <Content
          style={{
            margin: "20px 40px",
            padding: 20,
            background: "#fff",
            minHeight: 280
          }}
        >
          <MarketTicker />
        </Content>
        <IndexAd sysConfig={sysConfig} />
      </div>
    );
  }
}