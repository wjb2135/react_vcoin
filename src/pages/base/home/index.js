import React, { Component } from "react";
import Banner from "./inc/Banner";
import MarketTicker from "./inc/MarketTicker";
import IndexAd from "./inc/IndexAd";
import { Layout } from "antd";
import store from '../../../store'
import { connect } from "react-redux";
const { Content } = Layout;

class Home extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('componentDidMount');
  }
  componentWillMount() {
    console.log('componentWillMount');
  }
  render() {
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
        <IndexAd sysConfig={this.props.sysConfig} />
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    sysConfig: state.systemConfig
  }
}

export default connect(stateToProps, null)(Home)