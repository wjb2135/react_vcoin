import React, { Component } from 'react';
import { message } from "antd";
import { connect } from "react-redux";
import { getTimestamp, loadScript } from "@/assets/js/common";
import { Form, Input, Button, notification } from "antd";
import NECaptcha from "@components/validator/NECaptcha";
import "@styles/ForgetIndex.less";
import "@styles/ncpc.less";
var captchaIns = null;

class Forget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        account: "",
        verify_info: "",
      },
      rules: {
        mobile: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      moveDone: false,
      mobile: "18512349999",
      email: "wjb123@163.com",
      step: 1,
      warnText: "",
      showMoveBox: false,
      loading: false,
    };
  }
  accountInputBlur() {
    let self = this;
    if (self.state.form.account) {
      self.setState(
        {
          showMoveBox: true,
        },
        () => {
          self.initValidator();
        }
      );
    }
  }
  /**
   * 初始化验证器
   * 阿里云滑动验证、网易滑动拼图验证
   */
  initValidator() {
    let self = this;
    switch (this.props.sysConfig.used_wy_verification) {
      case "0":
        // 阿里云滑动验证
        if (!captchaIns) {
          this.showMoveBox = true;
          this.$nextTick(() => {
            this.initNc();
          });
        }
        break;
      case "1":
        // 网易滑动拼图验证
        if (!captchaIns) {
          self.setState(
            {
              showMoveBox: true,
            },
            () => {
              self.initNECaptcha();
            }
          );
        }
        break;

      default:
        break;
    }
  }
  /**
   * 网易滑动拼图验证初始化
   */
  initNECaptcha() {
    let self = this;
    let url =
      "http://cstaticdun.126.net/load.min.js" +
      "?t=" +
      getTimestamp(1 * 60 * 1000); // 时长1分钟，建议时长分钟级别
    loadScript(url, function () {
      // 进行初始化验证码等后续逻辑
      window.initNECaptcha(
        {
          lang: "zh-CN",
          captchaId: "8a0220bbde4b46c5a52a87813dce01a8",
          element: "#move-bs",
          mode: "float",
          width: "520px",
          onReady: function (instance) {
            // 验证码一切准备就绪，此时可正常使用验证码的相关功能
          },
          onVerify: function (err, data) {
            if (err) return; // 当验证失败时，内部会自动refresh方法，无需手动再调用一次
            self.setState({
              form: {
                verify_info: data.validate,
              },
            });
          },
        },
        function onload(instance) {
          captchaIns = instance;
        },
        function onerror(err) {
          // 初始化失败后触发该函数，err对象描述当前错误信息
          console.log(err);
        }
      );
    });
  }
  accountInputBlur() {
    let self = this;
    if (self.state.form.account) {
      self.setState(
        {
          showMoveBox: true,
        },
        () => {
          self.initValidator();
        }
      );
    }
  }
  /**
   * 验证账号
   */
  submit(form) {
    console.log(form);
    // let { form } = this.state;
    let newForm = Object.assign(this.state.form, form);
    this.setState({
      form: newForm
    });
    if (this.state.form.account == "") {
      message.error("请输入正确的手机");
      return false;
    }
    if (!this.state.form.verify_info) {
      message.error("请滑动滑块验证");
      return false;
    }
    this.loading = true;
    this.postRequestParam(`api/get_access_token`, this.state.form)
      .then((res) => {
        this.loading = false;
        const mobile = res.data.sms_verify_enabled == 1 ? res.data.mobile : "";
        const email = res.data.email_verify_enabled == 1 ? res.data.email : "";
        const username = res.data.username || "";
        const google =
          res.data.isset_google_key == 1 && res.data.google_verify_enabled == 1
            ? 1
            : 0;
        localStorage.setItem(
          "support_memory_word",
          res.data.support_memory_word
        );
        this.props.history.push(
          `/forget/step_two?mobile=${mobile}&email=${email}&google=${google}&username=${username}&access_token=${res.data.access_token}`
        );
      })
      .catch((err) => {
        this.loading = false;
        captchaIns && captchaIns.refresh(); // 重新初始化滑动拼图验证
      });
  }
  onBlur = e => {
    let self = this;
    const { value } = e.target;
    if (value) {
      self.setState(
        {
          showMoveBox: true,
        },
        () => {
          self.initValidator();
        }
      );
    }
  }
  render() {
    const showMoveBox = this.state.showMoveBox;
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const tailLayout = {
      wrapperCol: { offset: 4, span: 20 },
    };
    const onFinish = (values) => {
      console.log("Success:", values);
      this.submit(values);
    };
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    return (
      <>
        <div className="page-forget">
          <div
            id="_umfp"
            style={{
              display: "inline",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          ></div>
          <div className="register-wrap">
            <h2>重置登录密码</h2>
            <p className="tip">重置登录密码后24小时内禁止提币。</p>
            <Form
              {...layout}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="账号"
                name="account"
                rules={[
                  { required: true, message: "请输入手机 / 邮箱 / 用户名" },
                ]}
              >
                <Input
                  placeholder="手机 / 邮箱 / 用户名"
                  onBlur={this.onBlur}
                />
              </Form.Item>
              {showMoveBox && (
                <Form.Item label="验证">
                  <div
                    className="nc-container nc-container-custom"
                    id="move-bs"
                  ></div>
                </Form.Item>
              )}
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </>
    );
  }
}

const stateToProps = (state) => {
  return {
    sysConfig: state.systemConfig,
    visibleDialogVerify: state.visibleDialogVerify,
  };
};

const dispatchToProp = (dispatch) => {
  return {
    
  };
};

export default connect(stateToProps, dispatchToProp)(Forget);