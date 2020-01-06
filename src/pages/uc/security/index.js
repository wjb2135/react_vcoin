import React, { Component } from 'react';
import { connect } from "react-redux";
import { Modal } from 'antd';
import UserRecord from "./inc/UserRecord";
import UserIdentStatus from "./inc/UserIdentStatus";
import SetNickNameForm from "./inc/NickNameForm";
import { setVisibleNickNameFormAction } from '@/store/actionCreators';

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
  /**
   * 修改昵称对话框
   */
  setVisible(data) {
    this.props.setVisibleNickNameForm(data)
  }
  render() {
    const { visibleNickNameForm } = this.props
    return (
      <div className="page-security">
        {/* 用户信息 */}
        <UserRecord {...this.state} {...this.props} />
        {/* 安全设置项 */}
        <UserIdentStatus
          {...this.state}
          {...this.props}
          onChangeEmailVerifyEnabled={this.onChangeEmailVerifyEnabled.bind(this)}
          onChangeSmsVerifyEnabled={this.onChangeSmsVerifyEnabled.bind(this)}
          onChangeGoogleValidator={this.onChangeGoogleValidator.bind(this)}
          setVisible={this.setVisible.bind(this)}
        />
        {/* 设置昵称 */}
        <Modal
          title="设置昵称"
          visible={visibleNickNameForm}
          onCancel={() => this.props.setVisibleNickNameForm(false)}
          footer={null}
        >
          <SetNickNameForm />
        </Modal>
      </div>
    );
  }
}

const stateToProps = (state) => {
  const { baseUserInfo, systemConfig, visibleNickNameForm } = state
  return {
    baseUserInfo,
    systemConfig,
    visibleNickNameForm
  }
}
const dispatchToProps = (dispatch) => {
  return {
    setVisibleNickNameForm(data) {
      const action = setVisibleNickNameFormAction(data)
      dispatch(action)
    }
  }
}

export default connect(stateToProps, dispatchToProps)(Security);