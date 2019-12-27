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
  constructor(props, context) {
    super(props);
    this.state = {
      sysConfig: {}
    };
    console.log(store.getState());
    this.props.history.push('/home')
  }
  async getSysConfig() {
    let res = await this.postRequestParam('/api/system/get_config')
    this.setState({
      sysConfig: res.data.data
    });
  }
  componentDidMount() {
    console.log('componentDidMount');
    this.getSysConfig()
  }
  componentWillMount() {
    console.log('componentWillMount');
    
  }
  render() {
    console.log('render');
    const { sysConfig } = this.state;
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