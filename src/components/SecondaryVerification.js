import React, { Component } from 'react'
import { Tabs, Form, Icon, Input, Button, Modal } from 'antd'
const { TabPane } = Tabs

class SecondaryVerification extends Component {
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
      }
    });
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const googleVcodeError = isFieldTouched('google_vcode') && getFieldError('google_vcode');
    return(
      <Modal
        title="二次验证"
        visible={true}
        onOk={this.onClose()}
        onCancel={this.onClose()}
      >
        <div className="safe-verify">
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="谷歌验证" key="1">
              <Form layout="horizontal" onSubmit={this.handleSubmit}>
                <Form.Item validateStatus={googleVcodeError ? 'error' : ''} help={googleVcodeError || ''}>
                  {getFieldDecorator('google_vcode', {
                    rules: [{ required: true, message: '请输入谷歌验证码' }],
                  })(
                    <Input
                      placeholder="请输入谷歌验证码"
                    />,
                  )}
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="手机验证" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="邮箱验证" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    )
  }
}
const WrappedForm = Form.create({ name: 'secondary_verification' })(SecondaryVerification)
export default WrappedForm