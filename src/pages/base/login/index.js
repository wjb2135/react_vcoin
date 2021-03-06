import React, { Component } from "react";
import { connect } from 'react-redux'
import { notification } from "antd";
import SecondaryVerification from '@components/SecondaryVerification'
import NECaptcha from "@components/validator/NECaptcha"
import UILogin from "@components/Login";
import { setCookie } from '@/assets/js/cookieHandle'
import {
  sagaGetBaseUserInfoAction,
  setMobileVcodeSendingAction,
  setEmailVcodeSendingAction,
  setVisibleDialogVerifyAction,
  setVerifyTypeAction
} from "@/store/actionCreators";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogining: false,
      smsVerify: "", // 短信验证
      emailVerify: "", // 邮箱验证
      googleVerify: false, // 谷歌验证
      verifyDialogVisible: false,
      firstDialogVerifyVisible: false,
      formData: {
        sdk_type: "web",
        scene: "login"
      }
    };
    this.closeDialogVerifyVisible = this.closeDialogVerifyVisible.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.setFormVerifyInfo = this.setFormVerifyInfo.bind(this);
    this.setVerifyDialogVisible = this.setVerifyDialogVisible.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.setActiveName = this.setActiveName.bind(this);
  }
  form(o) {
    return o;
  }
  handleSubmit(form) {
    this.form = form;
    console.log(form)
    this.setState({
      isLogining: true,
    });
    this.postRequestParam("/api/login", form)
      .then((res) => {
        if (res.errcode === 0) {
          this.setState({
            isLogining: false,
          });
          setCookie("_TOKEN", res.data._token);
          notification.success({
            message: "登陆成功",
          });
          this.props.history.push("/");
        }
      })
      .then((res) => {
        this.props.getBaseLoginUserInfo();
      })
      .catch((err) => {
        this.setState({
          isLogining: false,
        });
        if (err.errcode === 10010) {
          // 表示需要短信、邮件或谷歌验证
          this.setState({
            verifyDialogVisible: true,
            smsVerify: err.data.mobile,
            emailVerify: err.data.email,
            googleVerify: !!err.data.google_bind,
          });
        } else if (err.errcode === 10013) {
          // 无需二次认证
          this.setState({
            firstDialogVerifyVisible: true,
          });
          switch (this.props.sysConfig.used_wy_verification) {
            case "0":
              // 阿里云滑动验证
              this.child.init();
              break;
            case "1":
              // 网易滑动拼图验证
              this.props.setVerifyType("mobile");
              this.props.setVisibleDialogVerify(true);
              break;

            default:
              break;
          }
        } else {
          // self.clearVcode()
        }
      });
  }
  submitForm() {
    let self = this;
    const { formData } = this.state;
    this.form.validateFields((err, values) => {
      if (!err) {
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            values[key] = formData[key];
          }
        }
        this.setState({
          isLogining: true
        });
        this.postRequestParam("/api/login", values)
          .then(res => {
			console.log(111)
            this.setState({
              isLogining: false
            });
            if (res.errcode === 0) {
              setCookie("_TOKEN", res.data._token);
              notification.success({
                message: "登陆成功"
              });
            }
          })
          .then(res => {
			console.log(222)
            this.props.getBaseLoginUserInfo();
            this.props.history.push("/");
          })
          .catch(err => {
            this.setState({
              isLogining: false
            });
            if (err.errcode === 10010) {
              // 表示需要短信、邮件或谷歌验证
              this.setState({
                verifyDialogVisible: true,
                smsVerify: err.data.mobile,
                emailVerify: err.data.email,
                googleVerify: !!err.data.google_bind
              });
            } else if (err.errcode === 10013) {
              // 无需二次认证
              self.setState({
                firstDialogVerifyVisible: true
              });
              switch (self.props.sysConfig.used_wy_verification) {
                case "0":
                  // 阿里云滑动验证
                  self.child.init();
                  break;
                case "1":
                  // 网易滑动拼图验证
                  self.child.init();
                  break;

                default:
                  break;
              }
            } else {
              // self.clearVcode()
              this.setState({
                formData: {}
              });
            }
          });
      }
    });
  }
  /**
   * 设置登陆时需要的验证信息
   * @param {Object} i 验证信息
   */
  setFormVerifyInfo(i) {
    let { formData } = this.state;
    formData.verify_info = i;
    this.setState({
      formData
    });
    this.submitForm();
  }
  /**
   * 关闭验证器（无需二次验证的）
   */
  closeDialogVerifyVisible(i) {
    this.setState({
      firstDialogVerifyVisible: false
    });
  }
  setVerifyDialogVisible(i) {
    const { setMobileVcodeSending, setEmailVcodeSending } = this.props;
    this.setState({
      verifyDialogVisible: i
    });
    if (!i) {
      setMobileVcodeSending(false);
      setEmailVcodeSending(false);
    }
  }
  onRef = ref => {
    this.child = ref;
  };
  /**
   * 二次验证 设置验证码到form表单中
   */
  setFormData(o) {
    const { setMobileVcodeSending, setEmailVcodeSending } = this.props;
    let { formData } = this.state;
    console.log("formData");
    console.log(formData);
    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        formData[key] = o[key];
      }
      this.setState({
        formData
      });
    }
    this.setState({
      verifyDialogVisible: false
    });
    setMobileVcodeSending(false);
    setEmailVcodeSending(false);
    this.submitForm();
  }
  setActiveName(i) {
    this.setState({
      activeName: i
    });
  }
  render() {
    const {
      smsVerify,
      emailVerify,
      googleVerify,
      verifyDialogVisible
    } = this.state;
    const { sysConfig, visibleDialogVerify } = this.props;
    return (
      <>
        <UILogin
          {...this.state}
          {...this.props}
          handleSubmit={this.handleSubmit.bind(this)}
          setFormData={this.setFormData}
          setVerifyDialogVisible={this.setVerifyDialogVisible}
        />
        {// 网易拼图验证器
        sysConfig.used_wy_verification === "1" && visibleDialogVerify && (
          <NECaptcha
            hasCallBack={true}
            formScene="login"
            setFormVerifyInfo={this.setFormVerifyInfo}
            onRef={this.onRef}
          />
        )}
        {/* 二次验证 */}
        {this.state.verifyDialogVisible && (
          <SecondaryVerification
            smsVerify={smsVerify}
            emailVerify={emailVerify}
            googleVerify={googleVerify}
            verifyDialogVisible={verifyDialogVisible}
            setFormData={this.setFormData}
            setVerifyDialogVisible={this.setVerifyDialogVisible}
            setActiveName={this.setActiveName}
          />
        )}
      </>
    );
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

export default connect(stateToProps, dispatchToProp)(Login);
