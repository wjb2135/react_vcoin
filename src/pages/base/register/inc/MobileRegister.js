import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  Form,
  Select,
  message,
  notification,
  Spin
} from "antd";
import { checkAction } from '@/assets/js/FanweUnity'
import { setVisibleDialogVerifyAction, setVerifyTypeAction } from "@/store/actionCreators";
import NECaptcha from "@components/validator/NECaptcha";
import UIMobileRegister from "@components/MobileRegister";
import "@styles/Register.less";
const { Option, OptGroup } = Select;

class mobileRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkNick: false,
      mobileVerifyCodeSended: false,
      isRegistering: false,
      mobile: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getMobileVerifyCode = this.getMobileVerifyCode.bind(this);
    this.handleChangeUserAgreement = this.handleChangeUserAgreement.bind(this);
    this.onSecondAreaCodeChange = this.onSecondAreaCodeChange.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
  }
  componentDidMount() {}
  handleSubmit(form) {
    let self = this;
    this.form = form;
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        this.setState({
          isRegistering: true
        });
        this.postRequestParam(`/api/register`, values)
          .then(res => {
            this.setState({
              isRegistering: false
            });
            if (res.errcode === 0) {
              notification.success({
                message: "注册成功"
              });
              self.props.history.push("/");
            }
          })
          .catch(err => {
            this.setState({
              isRegistering: false
            });
          });
      } else {
        if (err.country_code.errors && err.country_code.errors.length > 0) {
          message.error(err.country_code.errors[0].message);
        }
        return false;
      }
    });
  }
  // 同意用户协议
  handleChangeUserAgreement(e) {
    console.log(e);
    this.setState({
      checkNick: e.target.checked
    });
  }
  /**
   * 获取短信验证码
   */
  getMobileVerifyCode() {
    let self = this;
    const { form } = this.props;
    if (self.state.mobileVerifyCodeSended) {
      return false;
    }
    form.validateFields(["mobile"], (err, values) => {
      if (!err) {
        if (!values.mobile) {
          message.error("手机号码不能为空");
          return false;
        } else if (!checkAction.checkMobilePhone(values.mobile)) {
          message.error("手机号码格式错误");
          return false;
        }
        this.setState({
          verifyType: "mobile"
        });
        this.setState({
          mobile: values.mobile
        });
        console.log(values.mobile);
        this.props.setVerifyType("mobile");
        this.props.setVisibleDialogVerify(true);
      }
    });
  }
  /**
   * 国籍联动
   */
  onSecondAreaCodeChange(val) {
    let { options } = this.props;
    options.forEach((v, i, arr) => {
      v.option.forEach((value, index, array) => {
        if (val === value.area_code) {
          this.props.form.setFieldsValue({
            country: value.name_en
          });
        }
      });
    });
  }
  /**
   * 手机区号联动
   */
  onChangeCountry(val) {
    let { options } = this.props;
    options.forEach((v, i, arr) => {
      v.option.forEach((value, index, array) => {
        if (val === value.name_en) {
          this.props.form.setFieldsValue({
            country_code: value.area_code
          });
        }
      });
    });
  }
  onRef = ref => {
    this.child = ref;
  }
  render() {
    let { options } = this.props;
    if (options && options.length > 0) {
      // 国家列表数组去重
      for (var i_i = 0; i_i < options.length; i_i++) {
        let arr = options[i_i].option;
        for (var i = 0; i < arr.length; i++) {
          for (var j = i + 1; j < arr.length; j++) {
            if (
              arr[i].name_en === arr[j].name_en ||
              arr[i].area_code === arr[j].area_code
            ) {
              arr.splice(j, 1);
              j--;
            }
          }
        }
        options[i_i].option = arr;
      }
    }
    return (
      <>
        <UIMobileRegister
          {...this.props}
          {...this.state}
          options={options}
          handleSubmit={this.handleSubmit}
          getMobileVerifyCode={this.getMobileVerifyCode}
          onSecondAreaCodeChange={this.onSecondAreaCodeChange}
          onChangeCountry={this.onChangeCountry}
          handleChangeUserAgreement={this.handleChangeUserAgreement}
        />
        {// 网易拼图验证器
        this.props.sysConfig.used_wy_verification === "1" &&
          this.props.visibleDialogVerify && (
            <NECaptcha
              formScene="register"
              mobile={this.state.mobile}
              setFormVerifyInfo={this.setFormVerifyInfo}
              isBanding={true}
              onRef={this.onRef}
            />
          )}
      </>
    );
  }
}
const stateToProps = (state) => {
  return {
    appID: state.appID,
    sysConfig: state.systemConfig,
    visibleDialogVerify: state.visibleDialogVerify,
    mobileLeftTime: state.mobileLeftTime,
    mobileVcodeSending: state.mobileVcodeSending,
    loadingMobileVcodeSend: state.loadingMobileVcodeSend
  }
}
const dispatchToProps = (dispatch) => {
  return {
    setVisibleDialogVerify(data) {
      const action = setVisibleDialogVerifyAction(data)
      dispatch(action)
    },
    setVerifyType(data) {
      const action = setVerifyTypeAction(data)
      dispatch(action)
    }
  }
}
// const WrappedRegisterForm = Form.create({ name: "normal_register" })(mobileRegister);
export default connect(stateToProps, dispatchToProps)(mobileRegister);