import React, { Component } from 'react'
import { Tabs } from "antd";
import MobileRegister from "./inc/MobileRegister";
import "@styles/Register.less";
const { TabPane } = Tabs;

export default class register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: {}
    };
  }
  async componentDidMount() {
    let res = await this.postRequestParam("/api/system/get_country_list")
    this.setState({
      options: res.data.data
    });
  }
  callback(key) {
    console.log(key);
  }
  render() {
    return (
      <div className="page-register">
        <div className="register-wrap">
          <h2>欢迎注册</h2>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="手机注册" key="mobile">
              <MobileRegister options={this.state.options} />
            </TabPane>
            <TabPane tab="邮箱注册" key="email">
              Content of Tab Pane 2
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}