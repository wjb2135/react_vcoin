import React, { Component } from 'react'
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
      mobileLeftTime: '',
      emailLeftTime: '',
      mobileVcodeSending: false,
      emailVcodeSending: false
    }
    this.onClose = this.onClose.bind(this)
    this.callback = this.callback.bind(this)
    this.hndleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.setFormData = this.setFormData.bind(this)
    this.onChangeGoogleCode = this.onChangeGoogleCode.bind(this)
  }
  componentDidMount() {
    console.log('asdasd');
    console.log(this.props);
    this.setState({
      activeName: (this.props.googleVerify && 'google') || (this.props.smsVerify && 'mobile') || (this.props.emailVerify && 'email'),
      mobile: this.props.smsVerify,
      email: this.props.emailVerify
    })
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
    self.setState({
      verifyType: verifyType
    })
    if (verifyType === 'mobile') {
      // 发送短信验证码
      let formData
      // 绑定手机号
      formData = {
        mobile: mobile,
        sdk_type: 'web',
        scene: 'login'
      }
      self.setState({
        loadingMobileVcodeSend: true
      })
      self.postRequestParam(`/api/send_sms_vcode`, formData).then((res) => {
        self.setState({
          loadingMobileVcodeSend: false,
          mobileVcodeSending: true,
          mobileLeftTime: 60
        })
        let timer = setInterval(() => {
          if (mobileLeftTime <= 1) {
            clearInterval(timer)
            self.setState({
              mobileVcodeSending: false,
              mobileLeftTime: mobileLeftTime--
            })
          }
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
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setFormData(values)
      }
    });
  }
  onChangeGoogleCode(e) {
    this.setState({
      google_vcode: e.target.value
    })
  }
  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;
    const googleVcodeError = isFieldTouched('google_vcode') && getFieldError('google_vcode');
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
              <TabPane tab="谷歌验证" key="1">
                <Form onSubmit={this.handleSubmit}>
                  <Form.Item label="谷歌验证码" hasFeedback>
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
            </Tabs>
          </div>
        </Modal>
      </>
    )
  }
}
const WrappedForm = Form.create({ name:'secondary_verification' })(SecondaryVerification)
export default WrappedForm