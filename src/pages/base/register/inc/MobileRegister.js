import React, { Component } from 'react';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete
} from "antd";
import { Link } from "react-router-dom";
const { Option, OptGroup } = Select;

class mobileRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkNick: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getMobileVerifyCode = this.getMobileVerifyCode.bind(this);
  }
  componentDidMount() {}
  handleSubmit() {}
  handleChange() {}
  /**
   * 获取短信验证码
   */
  getMobileVerifyCode () {
    
  }
  render() {
    const { options } = this.props;
    const { getFieldDecorator } = this.props.form;
    let optionItem, optionItemAreaCode;
    if (options && options.length > 0) {
      optionItem = options.map((item, index) => (
        <OptGroup label={item.label} key={index}>
          {item.option.map((i, idx) => {
            return (
              <Option value={i.name_en} key={idx}>
                <span style={{ float: "left" }}>{i.name_en}</span>
                <span style={{ float: "right" }}>{i.name_cn}</span>
              </Option>
            );
          })}
        </OptGroup>
      ));
      optionItemAreaCode = options.map((item, index) => (
        <OptGroup label={item.label} key={index}>
          {item.option.map((i, idx) => {
            return (
              <Option value={i.area_code} key={idx}>
                <span style={{ float: "left" }}>{i.name_cn || i.name_en}</span>
                <span style={{ float: "right" }}>{i.area_code}</span>
              </Option>
            );
          })}
        </OptGroup>
      ));
    }
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "86"
    })(<Select style={{ width: 220 }}>{optionItemAreaCode}</Select>);
    const addonAfterSendVCode = (
      <span style={{cursor: 'pointer'}} onClick={this.getMobileVerifyCode}>发送验证码</span>
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
            })(<Select>{optionItem}</Select>)}
          </Form.Item>
          <Form.Item label="手机号码">
            {getFieldDecorator("country", {
              rules: [{ required: true, message: "请选择国籍" }]
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
            {getFieldDecorator("invitation_code", {
              rules: [{ required: true, message: "请输入您的邀请码" }]
            })(<Input />)}
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={this.state.checkNick}
              onChange={this.handleChange}
            >
              我已阅读并同意
              <Link to="">《用户协议》</Link>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedRegisterForm = Form.create({ name: "normal_register" })(mobileRegister);
 
export default WrappedRegisterForm;