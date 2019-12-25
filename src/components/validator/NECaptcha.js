import React, { Component } from 'react'
import { Modal, Button } from 'antd';
import { connect } from "react-redux";
import { getTimestamp, loadScript } from '@/assets/js/common'
import { setMobileVcodeSendingAction, setEmailVcodeSendingAction} from "@/store/actionCreators";
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
  }
  componentDidMount() {
    this.props.onRef(this)
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
        width: '520px',
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
        this.props.closeDialogVerifyVisible(false)
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
  sendVerifyCode(data) {
    let self = this
    const { verifyType, mobile, email, countryCode, formScene } = this.props
    let { mobileLeftTime, emailLeftTime } = this.state
    if (verifyType === 'mobile') {
      // 发送短信验证码
      let formData
      if (this.isBanding) {
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
      self.setState({
        loadingMobileVcodeSend: true
      })
      self.postRequestParam('/api/send_sms_vcode', formData).then((res) => {
        self.setState({
          loadingMobileVcodeSend: false,
          mobileVcodeSending: true,
          mobileLeftTime: 60
        })
        self.props.setMobileVcodeSending(true)
        let timer = setInterval(() => {
          if (self.state.mobileLeftTime <= 1) {
            clearInterval(timer)
            self.setState({
              mobileVcodeSending: false
            })
            self.props.setMobileVcodeSending(false)
          }
          self.setState({
            mobileLeftTime: mobileLeftTime--
          })
        }, 1000)
        self.props.closeDialogVerifyVisible()
      })
        .catch(() => {
          self.setState({
            loadingMobileVcodeSend: false,
            mobileVcodeSending: false
          })
          self.props.setMobileVcodeSending(false)
          captchaIns && captchaIns.refresh() // 重新初始化滑动拼图验证
        })
    } else {
      // 发送邮箱验证码
      let formData
      if (this.isBanding) {
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
      self.setState({
        loadingEmailVcodeSend: true
      })
      self.postRequestParam(`/api/send_email_vcode`, formData).then((res) => {
        self.setState({
          loadingEmailVcodeSend: false,
          emailVcodeSending: true,
          emailLeftTime: 60
        })
        self.props.setEmailVcodeSending(true)
        let timer = setInterval(() => {
          if (emailLeftTime <= 1) {
            clearInterval(timer)
            self.emailVcodeSending = false
            self.props.setEmailVcodeSending(false)
          }
          self.setState({
            emailLeftTime: emailLeftTime--
          })
        }, 1000)
        this.props.closeDialogVerifyVisible()
      })
        .catch(() => {
          self.setState({
            loadingEmailVcodeSend: false,
            emailVcodeSending: false
          })
          self.props.setEmailVcodeSending(false)
          captchaIns && captchaIns.refresh() // 重新初始化滑动拼图验证
        })
    }
  }
  onClose() {
    this.props.closeDialogVerifyVisible()
  }
  render() {
    return (
      <div>
        <span>123</span>
        <Modal
          title="验证"
          visible={this.props.dialogVerifyVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className="nc-container nc-container-custom" id="move-c"></div>
        </Modal>
      </div>
    )
  }
}

const dispatchToProp = (dispatch) => {
  return {
    setMobileVcodeSending() {
      const action = setMobileVcodeSendingAction();
      dispatch(action);
    },
    setEmailVcodeSending() {
      const action = setEmailVcodeSendingAction();
      dispatch(action);
    }
  };
}

export default connect(null, dispatchToProp)(NECaptcha)
