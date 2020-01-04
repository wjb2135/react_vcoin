import React, { Component } from 'react';
import { connect } from "react-redux";
import { getBaseUserInfoAction } from "@/store/actionCreators";
import UserRecord from "./inc/UserRecord";
import UserIdentStatus from "./inc/UserIdentStatus";

import '@styles/ucSecurity.less'

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameStatus: false,
      mailboxStatus: false,
      phoneStatus: false,
      capitalPsStatus: false,
      signStatus: false,
      isShowPopup: false,
      userInfo: '',
      loading: true,
      google_verify_enabled: false, // 当前谷歌验证是否开启
      sms_verify_enabled: false, // 当前短信验证是否开启
      email_verify_enabled: false, // 当前邮箱验证是否开启
      isShowGoogleVerifyDialog: false, // 显示验证开关Dialog
      isSuccessSetVerifyCodeSwitch: false, // 是否设置开关成功
      verifyEnabledType: '' // 当前要验证的类型  email/mobile/google
    }
  }
  componentDidMount() {
    // this.props.getBaseUserInfo()
  }
  /**
   * 切换邮箱验证开关Switch
   */
  onChangeEmailVerifyEnabled(visible) {
    this.setState({
      verifyEnabledType: 'email',
      isShowGoogleVerifyDialog: true
    })
  }
  /**
   * 切换短信验证开关Switch
   */
  onChangeSmsVerifyEnabled(visible) {
    this.setState({
      verifyEnabledType: 'mobile',
      isShowGoogleVerifyDialog: true
    })
  }
  /**
   * 切换谷歌身份验证器开关Switch
   */
  onChangeGoogleValidator(visible) {
    this.verifyEnabledType = 'google'
    this.isShowGoogleVerifyDialog = true
  }
  render() {
    const { userInfo } = this.props
    const nickname = userInfo && userInfo.nickname.substring(0, 1)
    const securityLevelText = {
      '0': '低',
      '1': '中',
      '2': '高'
    }
    console.log(userInfo.nickname);
    
    return (
      <div className="page-security">
        <UserRecord {...this.state} {...this.props} />
        <UserIdentStatus {...this.state} {...this.props} onChangeEmailVerifyEnabled={this.onChangeEmailVerifyEnabled.bind(this)} onChangeSmsVerifyEnabled={this.onChangeSmsVerifyEnabled.bind(this)} onChangeGoogleValidator={this.onChangeGoogleValidator.bind(this)} />
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    userInfo: state.baseUserInfo,
    systemConfig: state.systemConfig
  }
}
const dispatchToProps = (dispatch) => {
  return {
    getBaseUserInfo() {
      const action = getBaseUserInfoAction()
      dispatch(action)
    }
  }
}
 
export default connect(stateToProps, null)(Security);