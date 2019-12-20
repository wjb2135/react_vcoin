import React, { Component } from 'react'

export default class NECaptcha extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showWarn: false, // 是否提示警告
      mobileMoveDone: false, // 短信验证是否滑动
      mobileLeftTime: '', // 短信验证码倒计时
      mobileVcodeSending: false, // 短信验证码发送中
      emailMoveDone: false, // 邮箱验证是否滑动
      emailLeftTime: '', // 邮箱验证码倒计时
      emailVcodeSending: false, // 邮箱验证码发送中
      loadingMobileVcodeSend: false,
      loadingEmailVcodeSend: false
    }
  }
  /**
   * 滑动验证器确定回调
   */
  doneMove() {
    if (this.props.hasCallBack) {
      if (!this.state.mobileMoveDone) {
        this.setState({
          showWarn: true
        })
      } else {
        this.setState({
          showWarn: false
        })
        this.$emit('closeDialogVerifyVisible', false)
        this.$emit('setFormVerifyInfo', this.verifyInfo)
        this.props.setFormVerifyInfo(this.verifyInfo)
      }
    } else {
      if (this.verifyType === 'mobile') {
        if (!this.mobileMoveDone) {
          this.showWarn = true
        } else {
          this.showWarn = false
          this.sendVerifyCode(this.verifyInfo)
        }
      } else {
        if (!this.emailMoveDone) {
          this.showWarn = true
        } else {
          this.showWarn = false
          this.sendVerifyCode(this.verifyInfo)
        }
      }
    }
  }
  render() {
    const { verifyType } = this.props
    return (
      <Modal
        title="Basic Modal"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Alert message="拖动滑块验证" type="warning" showIcon />
        <div className="nc-container nc-container-custom" id="move-c"></div>
        <Button
          block
          type="primary"
          loading={(verifyType == 'mobile' && loadingMobileVcodeSend) || (verifyType == 'email' && loadingEmailVcodeSend) || false}onClick={handleClick}
          onClick={doneMove}
        >
          确定
        </Button>
      </Modal>
    )
  }
}

<template lang="pug">
  el-dialog(
    :title="$t('m.cctrade.capitals.address.verify')"
    width="560px"
    :visible.sync="dialogVerifyVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="onClose"
    class="dialog-verify"
  )
  <Modal
    title="Basic Modal"
    visible={this.state.visible}
    onOk={this.handleOk}
    onCancel={this.handleCancel}
  >
    el-alert(
      :title="$t('m.cctrade.capitals.address.alert.dragVerify')"
      type="warning"
      show-icon
      v-show="showWarn"
      :closable="false"
      style="margin-bottom:10px;"
    )
    div.nc-container.nc-container-custom#move-c
    el-button.fill(
      type="primary"
      style="margin-top:25px;"
      :loading="(verifyType == 'mobile' && loadingMobileVcodeSend) || (verifyType == 'email' && loadingEmailVcodeSend) || false"
      @click="doneMove"
      ) {{$t('m.cctrade.capitals.address.submit')}}
</template>

<script>
import { mapActions } from 'vuex'
import { getTimestamp, loadScript } from '@/assets/js/common'
var captchaIns = null
export default {
  props: {
    'dialogVerifyVisible': {
      type: Boolean,
      default: false
    },
    'verifyType': {
      type: String,
      default: ''
    },
    formScene: {
      type: String,
      default: '',
      required: true
    },
    isBanding: {
      type: Boolean,
      default: false
    },
    mobile: {
      type: String,
      default: ''
    },
    countryCode: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    hasCallBack: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showWarn: false, // 是否提示警告
      mobileMoveDone: false, // 短信验证是否滑动
      mobileLeftTime: '', // 短信验证码倒计时
      mobileVcodeSending: false, // 短信验证码发送中
      emailMoveDone: false, // 邮箱验证是否滑动
      emailLeftTime: '', // 邮箱验证码倒计时
      emailVcodeSending: false, // 邮箱验证码发送中
      loadingMobileVcodeSend: false,
      loadingEmailVcodeSend: false
    }
  },
  methods: {
    ...mapActions(['setMobileVcodeSending', 'setEmailVcodeSending']),
    /**
     * 网易滑动拼图验证初始化
     */
    init () {
      let self = this
      let lang = ''
      switch (localStorage.getItem('lang')) {
        case 'zh-cn':
          lang = 'zh-CN'
          break
        case 'zh-hk':
          lang = 'zh-TW'
          break
        case 'en-us':
          lang = 'en'
          break

        default:
          break
      }
      let url = 'http://cstaticdun.126.net/load.min.js' + '?t=' + getTimestamp(1 * 60 * 1000) // 时长1分钟，建议时长分钟级别
      loadScript(url, function () {
        // 进行初始化验证码等后续逻辑
        window.initNECaptcha({
          lang: lang,
          captchaId: '8a0220bbde4b46c5a52a87813dce01a8',
          element: '#move-c',
          mode: 'float',
          width: '520px',
          onReady: function (instance) {
            // 验证码一切准备就绪，此时可正常使用验证码的相关功能
          },
          onVerify: function (err, data) {
            if (err) return // 当验证失败时，内部会自动refresh方法，无需手动再调用一次
            if (self.hasCallBack) {
              self.mobileMoveDone = self.emailMoveDone = true
            } else {
              if (self.verifyType === 'mobile') {
                self.mobileMoveDone = true
              } else {
                self.emailMoveDone = true
              }
            }
            self.verifyInfo = data.validate
          }
        }, function onload (instance) {
          captchaIns = instance
        }, function onerror (err) {
        // 初始化失败后触发该函数，err对象描述当前错误信息
          console.log(err)
        })
      })
    },
    /**
     * 滑动验证器确定回调
     */
    doneMove () {
      if (this.hasCallBack) {
        if (!this.mobileMoveDone) {
          this.showWarn = true
        } else {
          this.showWarn = false
          this.$emit('closeDialogVerifyVisible', false)
          this.$emit('setFormVerifyInfo', this.verifyInfo)
        }
      } else {
        if (this.verifyType === 'mobile') {
          if (!this.mobileMoveDone) {
            this.showWarn = true
          } else {
            this.showWarn = false
            this.sendVerifyCode(this.verifyInfo)
          }
        } else {
          if (!this.emailMoveDone) {
            this.showWarn = true
          } else {
            this.showWarn = false
            this.sendVerifyCode(this.verifyInfo)
          }
        }
      }
    },
    sendVerifyCode (data) {
      let self = this
      if (self.verifyType === 'mobile') {
        // 发送短信验证码
        let formData
        if (this.isBanding) {
          // 绑定手机号
          formData = {
            mobile: this.mobile,
            country_code: this.countryCode,
            verify_info: data,
            scene: self.formScene
          }
        } else {
          // 已绑定手机号
          formData = {
            verify_info: data,
            scene: self.formScene
          }
        }
        self.loadingMobileVcodeSend = true
        self.$http.post(`${self._APIROOT}/send_sms_vcode`, formData).then((res) => {
          self.loadingMobileVcodeSend = false
          self.mobileVcodeSending = true
          self.setMobileVcodeSending(true)
          self.mobileLeftTime = 60
          let timer = setInterval(() => {
            if (self.mobileLeftTime <= 1) {
              clearInterval(timer)
              self.mobileVcodeSending = false
              self.setMobileVcodeSending(false)
            }
            self.mobileLeftTime--
          }, 1000)
          self.$emit('closeDialogVerifyVisible')
        })
          .catch(() => {
            self.loadingMobileVcodeSend = false
            self.mobileVcodeSending = false
            self.setMobileVcodeSending(false)
            captchaIns && captchaIns.refresh() // 重新初始化滑动拼图验证
          })
      } else {
        // 发送邮箱验证码
        let formData
        if (this.isBanding) {
          // 绑定手机号
          formData = {
            email: this.email,
            verify_info: data,
            scene: self.formScene
          }
        } else {
          // 已绑定手机号
          formData = {
            verify_info: data,
            scene: self.formScene
          }
        }
        self.loadingEmailVcodeSend = true
        self.$http.post(`${self._APIROOT}/send_email_vcode`, formData).then((res) => {
          self.loadingEmailVcodeSend = false
          self.emailVcodeSending = true
          self.setEmailVcodeSending(true)
          self.emailLeftTime = 60
          let timer = setInterval(() => {
            if (self.emailLeftTime <= 1) {
              clearInterval(timer)
              self.emailVcodeSending = false
              self.setEmailVcodeSending(false)
            }
            self.emailLeftTime--
          }, 1000)
          self.$emit('closeDialogVerifyVisible')
        })
          .catch(() => {
            self.loadingEmailVcodeSend = false
            self.emailVcodeSending = false
            self.setEmailVcodeSending(false)
            captchaIns && captchaIns.refresh() // 重新初始化滑动拼图验证
          })
      }
    },
    onClose () {
      this.$emit('closeDialogVerifyVisible')
    }
  }
}
</script>

<style lang="less">
  .dialog-verify {
    margin-top: 3vh;
  }
</style>
