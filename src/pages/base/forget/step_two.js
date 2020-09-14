import React, { Component } from "react";
import "@styles/ForgetStepTwo.less";
import { Layout, Input, Form, Button, Col, Row } from "antd";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class stepTwo extends Component {
  constructor(props) {
    super(props);
    console.log(props.location.state.email);
    this.state = {
      mobile: props.location.state.mobile || "",
      email: props.location.state.email || "",
      google: props.location.state.google || "",
      username: props.location.state.username || "",
      form: {
        email_vcode: "",
        mobile_vcode: "",
        google_code: "",
        access_token: props.location.state.access_token || "",
        mnemonic_word: [],
        scene: "getpassword",
      },
      emailVcodeSending: false, // 邮箱验证码是否发送成功
      mobileVcodeSending: false, // 手机验证码是否发送成功
      emailLeftTime: "", // 邮箱验证码倒计时
      mobileLeftTime: "", // 手机验证码倒计时
      loading: false,
      needChangeMnemonicword: true,
    };
  }
  /**
   * 验证码手机、邮箱
   */
  submit() {
    const { email, mobile, google } = this.state;
    this.setState({
      loading: true,
    });
    let oldForm = this.state.form;
    if (!email) {
      delete oldForm["email_vcode"];
    }
    if (!mobile) {
      delete oldForm["mobile_vcode"];
    }
    if (google != 1) {
      delete oldForm["google_code"];
    }
    if (true) {
      delete oldForm["mnemonic_word"];
    }
    this.setState({
      form: oldForm,
    });
    this.postRequestParam(`api/verify_access_token`, oldForm)
      .then((res) => {
        this.setState({
          loading: false,
        });
        this.props.history.push(
          `/forget/step_three?access_token=${this.state.form.access_token}`
        );
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
      });
  }
  /**
   * 获取短信验证码
   */
  getSmsVerifyCode() {
    const { mobileVcodeSending, form } = this.state;
    if (!mobileVcodeSending) {
      this.postRequestParam("/api/send_sms_vcode", {
        access_token: form.access_token,
        scene: "getpassword",
      })
        .then((res) => {
          this.setState(
            {
              mobileVcodeSending: true,
              mobileLeftTime: 60,
            },
            () => {
              let { mobileLeftTime } = this.state;
              let timer = setInterval(() => {
                if (mobileLeftTime <= 1) {
                  clearInterval(timer);
                  this.setState({
                    mobileVcodeSending: false,
                  });
                }
                mobileLeftTime--;
                this.setState({
                  mobileLeftTime: mobileLeftTime,
                });
              }, 1000);
            }
          );
        })
        .catch((err) => {});
    }
  }
  /**
   * 获取邮箱验证码
   */
  getEmailVerifyCode() {
    const { emailVcodeSending, form } = this.state;
    if (!emailVcodeSending) {
      this.postRequestParam("/api/send_email_vcode", {
        access_token: form.access_token,
        scene: "getpassword",
      })
        .then((res) => {
          this.setState(
            {
              emailVcodeSending: true,
              emailLeftTime: 60,
            },
            () => {
              let { emailLeftTime } = this.state;
              let timer = setInterval(() => {
                if (emailLeftTime <= 1) {
                  clearInterval(timer);
                  this.setState({
                    emailVcodeSending: false,
                  });
                }
                emailLeftTime--;
                this.setState({
                  emailLeftTime: emailLeftTime,
                });
              }, 1000);
            }
          );
        })
        .catch((err) => {});
    }
  }
  /**
   * 助记词表单赋值
   */
  setFormMnemonic(mnemonicArr) {
    let { newForm } = this.state;
    if (mnemonicArr && mnemonicArr.length > 0) {
      newForm.mnemonic_word = JSON.stringify(mnemonicArr);
      this.setState({
        form: newForm,
      });
    } else {
      newForm.mnemonic_word = "";
      this.setState({
        form: newForm,
      });
    }
  }
  /**
   * 正确顺序的助记词
   */
  setMnemonicList(mnemonicList) {
    let newMnemonicList = mnemonicList.map((item) => {
      return item;
    });
    this.setState({
      mnemonicList: newMnemonicList,
    });
  }
  setNeedChangeMnemonicword(visible) {
    this.setState({
      needChangeMnemonicword: visible,
    });
  }
  render() {
    const { email, emailVcodeSending, emailLeftTime, mobile, mobileVcodeSending, mobileLeftTime, google } = this.state;
    const onFinish = (values) => {
      console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    const selectBefore = (
      <Button type="primary">发送验证码</Button>
    );
    return (
      <>
        <div className="page-forget">
          <div className="register-wrap">
            <h2>重置登录密码</h2>
            <div className="tip">重置登录密码后24小时内禁止提币。</div>
            <div>
              <Form
                {...layout}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item label="邮箱" name="email">
                  <Input defaultValue={email} disabled />
                </Form.Item>
                <Form.Item label="邮箱验证码" name="email_vcode">
                  <Row gutter={10}>
                    <Col span={12}>
                      <Input />
                    </Col>
                    <Col span={12}>
                      <Button type="primary">
                        {
                          emailVcodeSending ? '再次发送' + emailLeftTime + 's' : '发送验证码'
                        }
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label="手机" name="mobile">
                  <Input defaultValue={mobile} disabled />
                </Form.Item>
                <Form.Item label="短信验证码" name="mobile_vcode">
                  <Row gutter={10}>
                    <Col span={12}>
                      <Input />
                    </Col>
                    <Col span={12}>
                      <Button type="primary">
                        {
                          mobileVcodeSending ? '再次发送' + mobileLeftTime + 's' : '发送验证码'
                        }
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                {
                  google == 1 && (
                    <Form.Item label="谷歌验证码" name="google_code">
                      <Input />
                    </Form.Item>
                  )
                }
                <Form.Item {...tailLayout}>
                  <Button type="primary">
                    提交
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default stepTwo;