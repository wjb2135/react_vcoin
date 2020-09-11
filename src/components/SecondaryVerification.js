import React, { Component } from 'react'
import { connect } from "react-redux";
import { Tabs, Form, Input, Modal, Button } from 'antd'
const { TabPane } = Tabs

class SecondaryVerification extends Component {
  constructor(props) {
    super(props)
    console.log(this.props);
    
    this.state = {
      activeName: '',
      mobile: '',
      email: '',
      google_vcode: '',
      mobile_vcode: '',
      email_vcode: '',
      dialogVerifyVisible: false,
      verifyType: '',
      mobileLeftTime: 60,
      emailLeftTime: '',
      mobileVcodeSending: false,
      emailVcodeSending: false
    }
    this.onClose = this.onClose.bind(this)
    this.callback = this.callback.bind(this)
    this.handleSubmitGoogle = this.handleSubmitGoogle.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.setFormData = this.setFormData.bind(this)
    this.onChangeGoogleCode = this.onChangeGoogleCode.bind(this)
    this.getMobileVerifyCode = this.getMobileVerifyCode.bind(this)
    // this.sendVerifyCode = this.sendVerifyCode.bind(this)
  }
  componentDidMount() {
    this.setState({
      activeName: (this.props.googleVerify && 'google') || (this.props.smsVerify && 'mobile') || (this.props.emailVerify && 'email'),
      mobile: this.props.smsVerify,
      email: this.props.emailVerify
    })
  }
  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }
  handleClick(e) {
    this.setState({
      verifyType: e.name
    })
  }
  setFormData(values) {
    this.props.setFormData(values)
  }
  sendVerifyCode(verifyType) {
    let self = this
    let { mobile, email, mobileVcodeSending, emailVcodeSending, mobileLeftTime, emailLeftTime } = this.state
    if (verifyType === 'mobile') {
      if (mobileVcodeSending) {
        return
      }
    } else {
      if (emailVcodeSending) {
        return
      }
    }
    if (verifyType === 'mobile') {
      // 发送短信验证码
      let formData
      // 绑定手机号
      formData = {
        mobile: mobile,
        sdk_type: 'web',
        scene: 'login'
      }
      // return
      self.postRequestParam(`/api/send_sms_vcode`, formData).then((res) => {
        self.setState({
          loadingMobileVcodeSend: false,
          mobileVcodeSending: true
        })
        let timer = setInterval(() => {
          if (mobileLeftTime <= 1) {
            clearInterval(timer)
            self.setState({
              mobileVcodeSending: false,
            })
          }
          self.setState({
            mobileLeftTime: mobileLeftTime--
          });
        }, 1000)
      })
        .catch(() => {
          self.setState({
            loadingMobileVcodeSend: false,
            mobileVcodeSending: false
          })
        })
    } else {
      // 发送邮箱验证码
      let formData
      // 绑定手机号
      formData = {
        email: email,
        sdk_type: 'web',
        scene: 'login'
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
        let timer = setInterval(() => {
          if (emailLeftTime <= 1) {
            clearInterval(timer)
            self.setState({
              emailVcodeSending: false,
              emailLeftTime: emailLeftTime--
            })
          }
        }, 1000)
      })
        .catch(() => {
          self.setState({
            loadingEmailVcodeSend: false,
            emailVcodeSending: false
          })
        })
    }
  }
  onClose() {
    this.props.setVerifyDialogVisible(false)
  }
  callback(key) {
    console.log(key);
  }
  handleSubmitGoogle = e => {
    e.preventDefault();
    this.props.form.validateFields(["google_vcode"], (err, values) => {
      if (!err) {
        this.setFormData(values);
      }
    });
  }
  handleSubmitMobile = e => {
    e.preventDefault();
    this.props.form.validateFields(['mobile_vcode'], (err, values) => {
      if (!err) {
        this.setFormData(values)
      }
    });
  }
  onChangeGoogleCode(e) {
    this.setState({
      google_vcode: e.target.value
    })
  }
  /**
   * 获取短信验证码
   */
  getMobileVerifyCode() {
    const { mobileVcodeSending } = this.props
    if (mobileVcodeSending) {
      return false
    }
    this.setState({
      verifyType: 'mobile'
    })
    this.props.setVerifyType('mobile')
    this.props.setVisibleDialogVerify(true)
  }
  render() {
    const { mobileVcodeSending, mobileLeftTime } = this.state;
    const { getFieldDecorator } = this.props.form;
    // const googleVcodeError = isFieldTouched('google_vcode') && getFieldError('google_vcode');

    const addonAfterSendVCode = (
      <>
        <span style={{ cursor: 'pointer' }} onClick={this.sendVerifyCode.bind(this, 'mobile')}>
          {
            mobileVcodeSending ? '再次发送' + mobileLeftTime + 's' : '发送验证码'
          }
        </span>
      </>
    )

    return(
      <>
        <Modal
          title="二次验证"
          visible={true}
          onCancel={this.onClose}
          width={400}
          footer={null}
        >
          <div className="safe-verify">
            <Tabs onChange={this.handleClick} type="card">
              {/* 谷歌验证码登陆 */}
              <TabPane tab="谷歌验证" key="1">
                <Form onSubmit={this.handleSubmitGoogle}>
                  <Form.Item label="谷歌验证码">
                    {getFieldDecorator('google_vcode', {
                      rules: [{ required: true, message: '请输入谷歌验证码' }],
                    })(
                      <Input
                        placeholder="谷歌验证码"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      确定
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              {/* 手机登陆 */}
              <TabPane tab="手机验证" key="2">
                <span>{this.state.mobile}</span>
                <Form onSubmit={this.handleSubmitMobile}>
                  <Form.Item label="手机">
                    <Input
                      defaultValue={this.state.mobile}
                      disabled={true}
                      addonAfter={addonAfterSendVCode}
                    />
                  </Form.Item>
                  <Form.Item label="手机验证码">
                    {
                      getFieldDecorator('mobile_vcode', {
                        rules: [{ required: true, message: '请输入手机验证码' }],
                      })(
                        <Input />
                      )
                    }
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      确定
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </>
    )
  }
}

// const stateToProps = (state) => {
//   return {
//     mobileVcodeSending: state.mobileVcodeSending
//   }
// }
// const dispatchToProps = (dispatch) => {
//   return {
//     setVisibleDialogVerify(data) {
//       const action = setVisibleDialogVerifyAction(data)
//       dispatch(action)
//     },
//     setVerifyType(data) {
//       const action = setVerifyTypeAction(data)
//       dispatch(action)
//     }
//   }
// }

// const WrappedForm = Form.create({ name:'secondary_verification' })(SecondaryVerification)
export default connect(null, null)(SecondaryVerification);