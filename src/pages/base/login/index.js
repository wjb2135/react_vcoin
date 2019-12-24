import React, { Component } from "react";
import { Form, Icon, Input, Button } from 'antd';
import { Link } from "react-router-dom";
import { getTimestamp, loadScript } from '@/assets/js/common'
import SecondaryVerification from '@components/SecondaryVerification'

import '@styles/Login.less'

var captchaIns = null
var captchaInsPop = null

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstDialogVerifyVisible: false,
      isLogining: false,
      visible: false,
      verify_info: {},
      showMoveBox: false,
      showWarn: false,
      warnText: '',
      closable: false,
      isLogining: false,
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
      firstDialogVerifyVisible: false
    }
  }
  componentDidMount() {
    console.log(this.props.match.params.id);
    this.setState({
      id: this.props.match.params.id
    })
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          isLogining: true
        })
        this.postRequestParam('/api/login', values).then((res) => {
          
        })
        .catch((err) => {
          this.setState({
            isLogining: false
          })
          console.log(err)
          // if (self.sysConfig.used_wy_verification === '1') {
          //   captchaIns && captchaIns.refresh() // 重新初始化滑动拼图验证
          //   captchaInsPop && captchaInsPop.refresh() // 重新初始化滑动拼图验证
          // } else {
          //   captchaIns && captchaIns.reload() // 重新初始化滑动验证
          //   captchaInsPop && captchaInsPop.reload() // 重新初始化滑动验证
          // }
          if (err.errcode == 10010) {
            // 表示需要短信、邮件或谷歌验证
            this.showModal()
            // self.verifyDialogVisible = true
            // self.smsVerify = err.data.mobile
            // self.emailVerify = err.data.email
            // self.googleVerify = !!err.data.google_bind
          } else if (err.errcode === 10013) {
            // // 无需二次认证
            // self.firstDialogVerifyVisible = true
            // switch (self.sysConfig.used_wy_verification) {
            //   case '0':
            //     // 阿里云滑动验证
            //     self.$nextTick(() => {
            //       self.$refs.nc_validator.init()
            //     })
            //     break
            //   case '1':
            //     // 网易滑动拼图验证
            //     self.$nextTick(() => {
            //       self.$refs.ne_validator.init()
            //     })
            //     break

            //   default:
            //     break
            // }
          } else {
            // self.clearVcode()
          }
        })
      }
      else {
      }
    });
  }
  /**
   * 网易滑动拼图验证初始化
   */
  initNECaptcha() {
    let self = this
    let lang = ''
    switch (localStorage.getItem('lang')) {
      case 'zh-cn':
        lang = 'zh-CN'
        break
      case 'zh-hk':
        lang = 'zh-TW'
        break
      case 'en-us':
        lang = 'en'
        break

      default:
        break
    }
    let url = 'http://cstaticdun.126.net/load.min.js' + '?t=' + getTimestamp(1 * 60 * 1000) // 时长1分钟，建议时长分钟级别
    loadScript(url, function () {
      // 进行初始化验证码等后续逻辑
      window.initNECaptcha({
        lang: lang,
        captchaId: '8a0220bbde4b46c5a52a87813dce01a8',
        element: '#move-b',
        mode: 'float',
        width: '520px',
        onReady: function (instance) {
          // 验证码一切准备就绪，此时可正常使用验证码的相关功能
        },
        onVerify: function (err, data) {
          if (err) return // 当验证失败时，内部会自动refresh方法，无需手动再调用一次
          self.form.verify_info = data.validate
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
   * 设置登陆时需要的验证信息
   * @param {Object} i 验证信息
   */
  setFormVerifyInfo(i) {
    this.setState({
      verify_info: i,
      firstDialogVerifyVisible: false
    })
    this.handleSubmit()
  }
  /**
   * 关闭验证器（无需二次验证的）
   */
  closeDialogVerifyVisible(i) {
    this.firstDialogVerifyVisible = i
  }
  setVerifyDialogVisible(i) {
    this.setState({
      verifyDialogVisible: i
    })
    // if (!i) {
    //   this.setMobileVcodeSending(false)
    //   this.setEmailVcodeSending(false)
    // }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page-login">
        <div className="register-wrap">
          <h2>欢迎登陆->{this.state.id}</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
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
                  placeholder="请输入密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {/* {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>记住密码</Checkbox>)} */}
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
          this.state.visible && (
            <SecondaryVerification
              smsVerify={this.state.smsVerify}
              emailVerify={this.state.emailVerify}
              googleVerify={this.state.googleVerify}
              setFormData={this.setFormData.bind(this)}
              setVerifyDialogVisible={this.setVerifyDialogVisible.bind(this)}
            />
          )
        }
      </div>
    )
  }
}
const WrappedLoginForm = Form.create({ name: 'normal_login' })(Login);
export default WrappedLoginForm;
