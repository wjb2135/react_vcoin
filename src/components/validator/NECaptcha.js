import React, { Component } from 'react'
import { Modal, Button } from 'antd';
import { connect } from "react-redux";
import { getTimestamp, loadScript } from '@/assets/js/common'
import {
  setMobileVcodeSendingAction,
  setEmailVcodeSendingAction,
  setVisibleDialogVerifyAction,
  runMobileVcodeLeftTimeAction,
  setLoadingMobileVcodeSendAction
} from "@/store/actionCreators";
var captchaIns = null
class NECaptcha extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showWarn: false, // 是否提示警告
      mobileMoveDone: false, // 短信验证是否滑动
      mobileLeftTime: '', // 短信验证码倒计时
      mobileVcodeSending: false, // 短信验证码发送中
      emailMoveDone: false, // 邮箱验证是否滑动
      emailLeftTime: '', // 邮箱验证码倒计时
      emailVcodeSending: false, // 邮箱验证码发送中
      loadingMobileVcodeSend: false,
      loadingEmailVcodeSend: false,
      visible: true
    }
    this.onClose = this.onClose.bind(this)
    this.doneMove = this.doneMove.bind(this)
  }
  /**
   * 网易滑动拼图验证初始化
   */
  init() {
    let self = this
    let url = 'http://cstaticdun.126.net/load.min.js' + '?t=' + getTimestamp(1 * 60 * 1000) // 时长1分钟，建议时长分钟级别
    const { verifyType, hasCallBack } = this.props
    loadScript(url, function () {
      // 进行初始化验证码等后续逻辑
      window.initNECaptcha({
        lang: 'zh-CN',
        captchaId: '8a0220bbde4b46c5a52a87813dce01a8',
        element: '#move-c',
        mode: 'embed',
        onReady: function (instance) {
          // 验证码一切准备就绪，此时可正常使用验证码的相关功能
        },
        onVerify: function (err, data) {
          if (err) return // 当验证失败时，内部会自动refresh方法，无需手动再调用一次
          if (hasCallBack) {
            self.setState({
              mobileMoveDone: true,
              emailMoveDone: true
            })
          } else {
            if (verifyType === 'mobile') {
              self.setState({
                mobileMoveDone: true
              })
            } else {
              self.setState({
                emailMoveDone: true
              })
            }
          }
          self.setState({
            verifyInfo: data.validate
          })
          self.doneMove()
        }
      }, function onload(instance) {
        captchaIns = instance
      }, function onerror(err) {
        // 初始化失败后触发该函数，err对象描述当前错误信息
        console.log(err)
      })
    })
  }
  /**
   * 滑动验证器确定回调
   */
  doneMove() {
    const { verifyType, hasCallBack } = this.props
    if (hasCallBack) {
      if (!this.state.mobileMoveDone) {
        this.setState({
          showWarn: true
        })
      } else {
        this.setState({
          showWarn: false
        })
        this.props.setVisibleDialogVerify(false)
        this.props.setFormVerifyInfo(this.state.verifyInfo)
      }
    } else {
      if (verifyType === 'mobile') {
        if (!this.state.mobileMoveDone) {
          this.setState({
            showWarn: true
          })
        } else {
          this.setState({
            showWarn: false
          })
          this.sendVerifyCode(this.state.verifyInfo)
        }
      } else {
        if (!this.state.emailMoveDone) {
          this.setState({
            showWarn: true
          })
        } else {
          this.setState({
            showWarn: false
          })
          this.sendVerifyCode(this.state.verifyInfo)
        }
      }
    }
  }
  /**
   * 再次发送短信验证码倒计时
   */
  runMobileTimer() {
    let { mobileLeftTime, setMobileVcodeSending, runMobileVcodeLeftTime } = this.props
    setMobileVcodeSending(true)
    let timerId = setInterval(() => {
      if (mobileLeftTime <= 1) {
        clearInterval(timerId)
        setMobileVcodeSending(false)
      }
      runMobileVcodeLeftTime(mobileLeftTime--)
    }, 1000)
  }
  /**
   * 再次发送邮箱验证码倒计时
   */
  runEmailTimer() {
    let { emailLeftTime, setEmailVcodeSending, runEmailVcodeLeftTime } = this.props
    setEmailVcodeSending(true)
    let timerId = setInterval(() => {
      if (emailLeftTime <= 1) {
        clearInterval(timerId)
        setEmailVcodeSending(false)
      }
      runEmailVcodeLeftTime(emailLeftTime--)
    }, 1000)
  }
  /**
   * 发送验证码
   * @param { Oject } data 验证信息
   */
  sendVerifyCode(data) {
    const { verifyType, mobile, email, countryCode, formScene, isBanding } = this.props
    this.props.setVisibleDialogVerify(false)
    if (verifyType === 'mobile') {
      // 发送短信验证码
      let formData
      if (isBanding) {
        // 绑定手机号
        formData = {
          mobile: mobile,
          country_code: countryCode,
          verify_info: data,
          scene: formScene
        }
      } else {
        // 已绑定手机号
        formData = {
          verify_info: data,
          scene: formScene
        }
      }
      this.props.setLoadingMobileVcodeSend(true)
      this.postRequestParam('/api/send_sms_vcode', formData).then((res) => {
        this.props.setLoadingMobileVcodeSend(false)
        this.runMobileTimer()
      })
        .catch(() => {
          this.props.setLoadingMobileVcodeSend(false)
          this.props.setMobileVcodeSending(false)
          captchaIns && captchaIns.refresh() // 重新初始化滑动拼图验证
        })
    } else {
      // 发送邮箱验证码
      let formData
      if (isBanding) {
        // 绑定手机号
        formData = {
          email: email,
          verify_info: data,
          scene: formScene
        }
      } else {
        // 已绑定手机号
        formData = {
          verify_info: data,
          scene: formScene
        }
      }
      this.setState({
        loadingEmailVcodeSend: true
      })
      this.postRequestParam(`/api/send_email_vcode`, formData).then((res) => {
        this.props.setLoadingEmailVcodeSend(false)
        this.runEmailTimer()
      })
        .catch(() => {
          this.props.setLoadingEmailVcodeSend(false)
          this.props.setEmailVcodeSending(false)
          captchaIns && captchaIns.refresh() // 重新初始化滑动拼图验证
        })
    }
  }
  onClose() {
    this.props.setVisibleDialogVerify(false)
  }
  componentDidMount() {
    this.init()
  }
  render() {
    return (
      <div>
        <Modal
          title="验证"
          visible={this.props.visibleDialogVerify}
          width={300}
          footer={null}
          onCancel={this.onClose}
        >
          <div className="nc-container nc-container-custom" id="move-c"></div>
        </Modal>
      </div>
    )
  }
}
const stateToProps = (state) => {
  return {
    mobileLeftTime: state.mobileLeftTime,
    visibleDialogVerify: state.visibleDialogVerify,
    verifyType: state.verifyType
  }
}
const dispatchToProp = (dispatch) => {
  return {
    setMobileVcodeSending(data) {
      const action = setMobileVcodeSendingAction(data);
      dispatch(action);
    },
    setEmailVcodeSending(data) {
      const action = setEmailVcodeSendingAction(data);
      dispatch(action);
    },
    setLoadingMobileVcodeSend(data) {
      const action = setLoadingMobileVcodeSendAction(data)
      dispatch(action)
    },
    setVisibleDialogVerify(verify) {
      const action = setVisibleDialogVerifyAction(verify)
      dispatch(action)
    },
    runMobileVcodeLeftTime(data) {
      const action = runMobileVcodeLeftTimeAction(data)
      dispatch(action)
    }
  };
}

export default connect(stateToProps, dispatchToProp)(NECaptcha)
