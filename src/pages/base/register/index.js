import React, { Component } from 'react'
import { connect } from "react-redux";
import { Tabs } from "antd";
import MobileRegister from "./inc/MobileRegister";
import EmailRegister from "./inc/EmailRegister";
import "@styles/Register.less";
const { TabPane } = Tabs;

var captchaIns = null
var captchaInsPop = null

class register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: {},
      dialogVerifyVisible: false
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
  /**
   * 拖动验证弹窗显隐设置
   * params {Boolean} visible
   */
  changeDialogVerifyVisible(visible) {
    this.setState({
      dialogVerifyVisible: visible
    })
  }
  initVerifyPopNc() {
    this.props.setVisibleDialogVerify(true)
  }
  onRef = (ref) => {
    this.child = ref
  }
  render() {
    return (
      <div className="page-register">
        <div className="register-wrap">
          <h2>欢迎注册</h2>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="手机注册" key="mobile">
              <MobileRegister options={this.state.options} initNc={this.initVerifyPopNc.bind(this)} changeDialogVerifyVisible={this.changeDialogVerifyVisible.bind(this)} />
            </TabPane>
            <TabPane tab="邮箱注册" key="email">
              <EmailRegister />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

const stateToProps = (state) => {
  return { 
    sysConfig: state.systemConfig,
    visibleDialogVerify: state.visibleDialogVerify
  }
}

export default connect(stateToProps, null)(register)