import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  message,
  Spin
} from "antd";
import { Link, withRouter } from "react-router-dom";
import { checkAction } from '@/assets/js/FanweUnity'
import { setVisibleDialogVerifyAction, setVerifyTypeAction } from "@/store/actionCreators";
import NECaptcha from "@components/validator/NECaptcha";
const { Option, OptGroup } = Select;

class mobileRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkNick: false,
      mobileVerifyCodeSended: false,
      isRegistering: false,
      mobile: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getMobileVerifyCode = this.getMobileVerifyCode.bind(this);
    this.handleChangeUserAgreement = this.handleChangeUserAgreement.bind(this);
  }
  componentDidMount() {}
  handleSubmit = e => {
    let self = this
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          isRegistering: true
        })
        this.postRequestParam(`/api/register`, values).then((res) => {
          this.setState({
            isRegistering: false
          })
          if (res.errcode == 0) {
            message.success('注册成功');
            setTimeout(() => {
              self.props.history.push('/');
            }, 3000)
          }
        })
          .catch((err) => {
            this.setState({
              isRegistering: false
            })
          })
      } else {
        if (err.country_code.errors && err.country_code.errors.length > 0) {
          message.error(err.country_code.errors[0].message)
        }
        return false
      }
    });
  }
  // 同意用户协议
  handleChangeUserAgreement(e) {
    console.log(e);
    this.setState({
      checkNick: e.target.checked
    })
  }
  handleChanges(value) {
    console.log(`selected ${value}`);
  }
  /**
   * 获取短信验证码
   */
  getMobileVerifyCode() {
    let self = this
    const { form, appID } = this.props
    if (self.state.mobileVerifyCodeSended) {
      return false
    }
    form.validateFields(['mobile'], (err, values) => {
      if (!err) {
        if (!values.mobile) {
          message.error('手机号码不能为空')
          return false
        }
        else if (!checkAction.checkMobilePhone(values.mobile)) {
          message.error('手机号码格式错误')
          return false
        }
        this.setState({
          verifyType: 'mobile'
        })
        this.setState({
          mobile: values.mobile
        })
        console.log(values.mobile)
        this.props.setVerifyType('mobile')
        this.props.setVisibleDialogVerify(true)
      }
    })
  }
  render() {
    let { options, mobileLeftTime, mobileVcodeSending } = this.props;
    const { getFieldDecorator } = this.props.form;
    let optionItem, optionItemAreaCode;
    if (options && options.length > 0) {

      // 国家列表数组去重
      for (var i_i = 0; i_i < options.length; i_i++) {
        let arr = options[i_i].option
        for (var i = 0; i < arr.length; i++) {
          for (var j = i + 1; j < arr.length; j++) {
            if (arr[i].name_en == arr[j].name_en || arr[i].area_code == arr[j].area_code) {
              arr.splice(j, 1);
              j--;
            }
          }
        }
        options[i_i].option = arr
      }

      optionItem = options.map((i, k) => 
        <OptGroup label={i.label} key={k}>
          {
            i.option.map((i_i, k_k) => 
              <Option value={i_i.name_en} key={i_i.country_id}>
                <span>{(i_i.name_cn && i_i.name_cn !== '(Not supported)') ? i_i.name_cn : i_i.name_en}</span>
              </Option>
            )
          }
        </OptGroup>
      )

      optionItemAreaCode = options.map((i, k) =>
        <OptGroup label={i.label} key={k}>
          {
            i.option.map((i_i, k_k) =>
              <Option value={i_i.area_code} key={i_i.country_id}>
                <span>{i_i.area_code}</span>
              </Option>
            )
          }
        </OptGroup>
      )
    }

    const prefixSelector = getFieldDecorator("country_code", {
      rules: [{ required: true, message: "请选择手机区号" }]
    })(
      <Select style={{ width: 120 }}>{optionItemAreaCode}</Select>
    )
    const addonAfterSendVCode = (
      <>
        <Spin spinning={this.props.loadingMobileVcodeSend} delay={500} size="small" />
        <span style={{cursor: 'pointer'}} onClick={this.getMobileVerifyCode}>
          {
            mobileVcodeSending ? '再次发送' + mobileLeftTime + 's' : '发送验证码'
          }
        </span>
      </>
    )
    return (
      <div>
        <p className="tip">
          国籍信息注册后不可修改，请务必如实选择。验证邮件可能会被误判为垃圾邮件，请注意查收。
          请妥善保存您的账号及登录密码。
        </p>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="国籍">
            {getFieldDecorator("country", {
              rules: [{ required: true, message: "请选择国籍" }]
            })(<Select className="select-country" onChange={this.handleChanges}>{optionItem}</Select>)}
          </Form.Item>
          <Form.Item label="手机号码">
            {getFieldDecorator("mobile", {
              rules: [{ required: true, message: "请填写手机号码" }]
            })(
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            )}
          </Form.Item>
          <Form.Item label="短信验证码">
            {getFieldDecorator("verify_code", {
              rules: [{ required: true, message: "请输入短信验证码" }]
            })(<Input addonAfter={addonAfterSendVCode} />)}
          </Form.Item>
          <Form.Item label="登陆密码">
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入登陆密码" }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="确认密码">
            {getFieldDecorator("check_password", {
              rules: [{ required: true, message: "请再次输入登陆密码" }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="邀请码">
            {getFieldDecorator("invitation_code")(<Input />)}
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={this.state.checkNick}
              onChange={this.handleChangeUserAgreement}
            >
              我已阅读并同意
              <Link to="">《用户协议》</Link>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={this.state.isRegistering} disabled={!this.state.checkNick}>
              注册
            </Button>
          </Form.Item>
        </Form>
        {
          // 网易拼图验证器
          this.props.sysConfig.used_wy_verification == '1' && this.props.visibleDialogVerify && (
            <NECaptcha
              formScene="register"
              mobile={this.state.mobile}
              setFormVerifyInfo={this.setFormVerifyInfo}
              isBanding={true}
              onRef={this.onRef}
            />
          )
        }
      </div>
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
const WrappedRegisterForm = Form.create({ name: "normal_register" })(mobileRegister);
export default withRouter(connect(stateToProps, dispatchToProps)(WrappedRegisterForm));