import React, { Component } from 'react';
import { connect } from "react-redux";
import { Form, Input, Button, notification } from 'antd';
import { sagaGetBaseUserInfoAction, setVisibleNickNameFormAction } from "@/store/actionCreators";
class SetNickNameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
    this.handleSetNickName = this.handleSetNickName.bind(this);
  }
  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  /**
   * 修改昵称
   */
  handleSetNickName(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        this.postRequestParam('/api/set_security_info', values).then(() => {
          this.setState({
            loading: false
          })
          notification.success({
            message: "修改成功"
          })
          this.props.getBaseUserInfo()
        }).then(() => {
          this.props.setVisibleNickNameForm(false)
        })
      }
    })
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const nicknameError = isFieldTouched('nickname') && getFieldError('nickname');
    return (
      <Form onSubmit={this.handleSetNickName}>
        <Form.Item validateStatus={nicknameError ? 'error' : ''}>
          {getFieldDecorator('nickname', {
            rules: [
              { required: true, message: '请输入昵称' },
              { max: 20, message: '昵称长度不能超过20个字符' },
              { min: 4, message: '昵称长度不能少于4个字符' }
            ],
          })(
            <Input
              placeholder="请输入昵称"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={this.hasErrors(getFieldsError())} loading={this.state.loading}>修改</Button>
        </Form.Item>
      </Form>
    );
  }
}

const dispatchToProps = (dispatch) => {
  return {
    setVisibleNickNameForm() {
      const action = setVisibleNickNameFormAction()
      dispatch(action)
    },
    getBaseUserInfo() {
      const action = sagaGetBaseUserInfoAction()
      dispatch(action)
    }
  }
}

const WrappedSetNickNameForm = Form.create({name: 'set_nickname'})(SetNickNameForm);
export default connect(null, dispatchToProps)(WrappedSetNickNameForm);