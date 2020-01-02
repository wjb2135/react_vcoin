import React from 'react';
import { Form, Input, Select, Checkbox, Button, Spin } from "antd";
import { Link, withRouter } from "react-router-dom";
const { Option, OptGroup } = Select;
function MobileRegister(props) {
  let {
    options,
    checkNick,
    isRegistering,
    mobileLeftTime,
    loadingMobileVcodeSend,
    mobileVcodeSending,
    getMobileVerifyCode,
    onSecondAreaCodeChange,
    onChangeCountry,
    handleChangeUserAgreement
  } = props;
  const { getFieldDecorator } = props.form;
  let optionItem, optionItemAreaCode;
  if (options && options.length > 0) {
    optionItem = options.map((i, k) => (
      <OptGroup label={i.label} key={k}>
        {i.option.map((i_i, k_k) => (
          <Option value={i_i.name_en} key={i_i.country_id}>
            <span>
              {i_i.name_cn && i_i.name_cn !== "(Not supported)"
                ? i_i.name_cn
                : i_i.name_en}
            </span>
          </Option>
        ))}
      </OptGroup>
    ));

    optionItemAreaCode = options.map((i, k) => (
      <OptGroup label={i.label} key={k}>
        {i.option.map((i_i, k_k) => (
          <Option value={i_i.area_code} key={i_i.country_id}>
            <span>{i_i.area_code}</span>
          </Option>
        ))}
      </OptGroup>
    ));
  }

  const prefixSelector = getFieldDecorator("country_code", {
    rules: [{ required: true, message: "请选择手机区号" }]
  })(
    <Select style={{ width: 120 }} onChange={onSecondAreaCodeChange}>
      {optionItemAreaCode}
    </Select>
  );
  const addonAfterSendVCode = (
    <>
      <Spin
        spinning={loadingMobileVcodeSend}
        delay={500}
        size="small"
      />
      <span style={{ cursor: "pointer" }} onClick={getMobileVerifyCode}>
        {mobileVcodeSending ? "再次发送" + mobileLeftTime + "s" : "发送验证码"}
      </span>
    </>
  );
  const handleSubmit = function(e) {
    e.preventDefault();
    props.handleSubmit(props.form);
  };
  return (
    <div>
      <p className="tip">
        国籍信息注册后不可修改，请务必如实选择。验证邮件可能会被误判为垃圾邮件，请注意查收。
        请妥善保存您的账号及登录密码。
      </p>
      <Form onSubmit={handleSubmit}>
        <Form.Item label="国籍">
          {getFieldDecorator("country", {
            rules: [{ required: true, message: "请选择国籍" }]
          })(
            <Select className="select-country" onChange={onChangeCountry}>
              {optionItem}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="手机号码">
          {getFieldDecorator("mobile", {
            rules: [{ required: true, message: "请填写手机号码" }]
          })(<Input addonBefore={prefixSelector} style={{ width: "100%" }} />)}
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
            checked={checkNick}
            onChange={handleChangeUserAgreement}
          >
            我已阅读并同意
            <Link to="">《用户协议》</Link>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isRegistering}
            disabled={!checkNick}
          >
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const UIMobileRegister = Form.create({ name: "normal_register" })(MobileRegister);
export default withRouter(UIMobileRegister);