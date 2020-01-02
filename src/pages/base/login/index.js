import React, { Component } from "react";
import { Form, Icon, Input, Button, notification } from "antd";
import { Link } from "react-router-dom";
import SecondaryVerification from '@components/SecondaryVerification'
import NECaptcha from "@components/validator/NECaptcha"
import { setCookie } from '@/assets/js/cookieHandle'
import {
  sagaGetBaseUserInfoAction,
  setMobileVcodeSendingAction,
  setEmailVcodeSendingAction,
  setVisibleDialogVerifyAction,
  setVerifyTypeAction
} from "@/store/actionCreators";
import { connect } from 'react-redux'

import '@styles/Login.less'

// var captchaIns = null
// var captchaInsPop = null

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      password: '',
      verifyType: '',
      isLogining: false,
      visible: false,
      verify_info: {},
      showMoveBox: false,
      showWarn: false,
      warnText: '',
      closable: false,
      nc: null,
      smsVerify: '', // 短信验证
      emailVerify: '', // 邮箱验证
      googleVerify: false, // 谷歌验证
      verifyDialogVisible: false,
      mobileVcodeSending: false,
      emailVcodeSending: false,
      mobileLeftTime: '',
      emailLeftTime: '',
      isSendMobileCodeLoading: false, // 是否正在发送短信验证码
      isSendEmailCodeLoading: false, // 是否正在发送邮箱验证码
      showVerifyWarn: false,
      moveMobileDone: false,
      moveEmailDone: false,
      firstDialogVerifyVisible: false,
      formData: {
        sdk_type: 'web',
        scene: 'login'
      }
    }
    this.closeDialogVerifyVisible = this.closeDialogVerifyVisible.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.setFormVerifyInfo = this.setFormVerifyInfo.bind(this)
    this.setVerifyDialogVisible = this.setVerifyDialogVisible.bind(this)
    this.setFormData = this.setFormData.bind(this)
    this.setActiveName = this.setActiveName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(e) {
    let self = this
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          isLogining: true
        })
        this.postRequestParam('/api/login', values).then((res) => {
          if (res.errcode === 0) {
            setCookie('_TOKEN', res.data._token)
          }
        })
          .then((res) => {
            this.props.getBaseLoginUserInfo()
          })
          .catch((err) => {
            this.setState({
              isLogining: false
            })
            if (err.errcode === 10010) {
              // 表示需要短信、邮件或谷歌验证
              this.setState({
                verifyDialogVisible: true,
                smsVerify: err.data.mobile,
                emailVerify: err.data.email,
                googleVerify: !!err.data.google_bind
              })
            } else if (err.errcode === 10013) {
              // 无需二次认证
              self.setState({
                firstDialogVerifyVisible: true
              })
              switch (self.props.sysConfig.used_wy_verification) {
                case '0':
                  // 阿里云滑动验证
                  self.child.init()
                  break
                case '1':
                  // 网易滑动拼图验证
                  this.props.setVerifyType('mobile')
                  this.props.setVisibleDialogVerify(true)
                  break

                default:
                  break
              }
            } else {
              // self.clearVcode()
            }
          })
      }
      else {
      }
    });
  }
  submitForm(e) {
    let self = this
    const { formData } = this.state
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            values[key] = formData[key]
          }
        }
        this.setState({
          isLogining: true
        })
        this.postRequestParam('/api/login', values).then((res) => {
          this.setState({
            isLogining: false
          })
          if (res.errcode === 0) {
            setCookie('_TOKEN', res.data._token)
            notification.success({
              message: "登陆成功"
            });
          }
        })
          .then((res) => {
            this.props.getBaseLoginUserInfo()
            this.props.history.push('/');
          })
          .catch((err) => {
            this.setState({
              isLogining: false
            })
            if (err.errcode === 10010) {
              // 表示需要短信、邮件或谷歌验证
              this.setState({
                verifyDialogVisible: true,
                smsVerify: err.data.mobile,
                emailVerify: err.data.email,
                googleVerify: !!err.data.google_bind
              })
            } else if (err.errcode === 10013) {
              // 无需二次认证
              self.setState({
                firstDialogVerifyVisible: true
              })
              switch (self.props.sysConfig.used_wy_verification) {
                case '0':
                  // 阿里云滑动验证
                  self.child.init()
                  break
                case '1':
                  // 网易滑动拼图验证
                  self.child.init()
                  break

                default:
                  break
              }
            } else {
              // self.clearVcode()
              this.setState({
                formData: {}
              })
            }
          })
      }
    })
  }
  /**
   * 设置登陆时需要的验证信息
   * @param {Object} i 验证信息
   */
  setFormVerifyInfo(i) {
    let { formData } = this.state
    formData.verify_info = i
    this.setState({
      formData
    })
    this.submitForm()
  }
  /**
   * 关闭验证器（无需二次验证的）
   */
  closeDialogVerifyVisible(i) {
    this.setState({
      firstDialogVerifyVisible: false
    })
  }
  setVerifyDialogVisible(i) {
    const { setMobileVcodeSending, setEmailVcodeSending } = this.props
    this.setState({
      verifyDialogVisible: i
    })
    if (!i) {
      setMobileVcodeSending(false)
      setEmailVcodeSending(false)
    }
  }
  onRef = (ref) => {
    console.log('ref');
    console.log(ref);
    this.child = ref
  }
  /**
   * 二次验证 设置验证码到form表单中
   */
  setFormData(o) {
    const { setMobileVcodeSending, setEmailVcodeSending } = this.props
    let { formData } = this.state
    console.log('formData')
    console.log(formData)
    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        formData[key] = o[key]
      }
      this.setState({
        formData
      })
    }
    this.setState({
      verifyDialogVisible: false,
    })
    setMobileVcodeSending(false)
    setEmailVcodeSending(false)
    this.submitForm()
  }
  setActiveName(i) {
    this.setState({
      activeName: i
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page-login">
        <div className="register-wrap">
          <h2>欢迎登陆</h2>
          <Form className="login-form" onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入登陆账号' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="手机 / 邮箱 / 用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  autoComplete="off"
                  placeholder="请输入密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <a className="login-form-forgot" href="">忘记密码？</a>
              <Button type="primary" loading={this.state.isLogining} htmlType="submit" className="login-form-button">登陆</Button>
            </Form.Item>
          </Form>
          <div>
            <p>还没有账号？</p>
            <p>立即注册，在全球领先的数字资产交易平台开始交易。</p>
            <Link to="/register">免费注册</Link>
          </div>
        </div>
        {
          // 网易拼图验证器
          this.props.sysConfig.used_wy_verification === '1' && this.props.visibleDialogVerify && (
            <NECaptcha
              hasCallBack={true}
              formScene="login"
              setFormVerifyInfo={this.setFormVerifyInfo}
              onRef={this.onRef}
            />
          )

      }
        {/* 二次验证 */}
        {
          this.state.verifyDialogVisible && (
            <SecondaryVerification
              smsVerify={this.state.smsVerify}
              emailVerify={this.state.emailVerify}
              googleVerify={this.state.googleVerify}
              verifyDialogVisible={this.state.verifyDialogVisible}
              setFormData={this.setFormData}
              setVerifyDialogVisible={this.setVerifyDialogVisible}
              setActiveName={this.setActiveName}
            />
          )
        }
      </div>
    )
  }
}

const stateToProps = (state) => {
  return {
    sysConfig: state.systemConfig,
    visibleDialogVerify: state.visibleDialogVerify
  }
}

const dispatchToProp = (dispatch) => {
  return {
    getBaseLoginUserInfo() {
      const action = sagaGetBaseUserInfoAction();
      dispatch(action);
    },
    setMobileVcodeSending(data) {
      const action = setMobileVcodeSendingAction(data);
      dispatch(action);
    },
    setEmailVcodeSending(data) {
      const action = setEmailVcodeSendingAction(data);
      dispatch(action);
    },
    setVisibleDialogVerify(data) {
      const action = setVisibleDialogVerifyAction(data)
      dispatch(action)
    },
    setVerifyType(data) {
      const action = setVerifyTypeAction(data)
      dispatch(action)
    }
  };
}

const WrappedLoginForm = Form.create({ name: 'normal_login' })(Login);



export default connect(stateToProps, dispatchToProp)(WrappedLoginForm);
