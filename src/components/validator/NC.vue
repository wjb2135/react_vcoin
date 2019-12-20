<template lang="pug">
  el-dialog(
    :title="$t('m.usercenter.seting.protection_code.verification')"
    width="560px"
    :visible.sync="dialogVerifyVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="onClose"
    class="dialog-verify"
  )
    el-alert(
      :title="$t('m.usercenter.seting.protection_code.dragSlider')"
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
      ) {{$t('m.usercenter.seting.protection_code.determine')}}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
    scene: {
      type: String,
      default: 'nc_login',
      required: true
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
     * 初始化滑动验证器
     */
    init () {
      let lang
      let self = this
      let ncToken = [self.appID, (new Date()).getTime(), Math.random()].join(':')
      switch (localStorage.getItem('lang')) {
        case 'zh-cn':
          lang = 'cn'
          break
        case 'zh-hk':
          lang = 'tw'
          break
        case 'en-us':
          lang = 'en'
          break

        default:
          break
      }
      let NCOpt = {
        renderTo: '#move-c',
        appkey: self.appID,
        scene: self.scene, // scene: "nc_register",
        token: ncToken,
        trans: {'key1': 'code0'},
        elementID: ['usernameID'],
        is_Opt: 0,
        language: lang,
        isEnabled: true,
        timeout: 3000,
        times: 5,
        apimap: {
          // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
          // 'get_captcha': '//b.com/get_captcha/ver3',
          // 'get_captcha': '//pin3.aliyun.com/get_captcha/ver3'
          // 'get_img': '//c.com/get_img',
          // 'checkcode': '//d.com/captcha/checkcode.jsonp',
          // 'umid_Url': '//e.com/security/umscript/3.2.1/um.js',
          // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
          // 'umid_serUrl': 'https://g.com/service/um.json'
        },
        callback: function (data) {
          if (this.hasCallBack) {
            self.mobileMoveDone = self.emailMoveDone = true
          } else {
            if (self.verifyType === 'mobile') {
              self.mobileMoveDone = true
            } else {
              self.emailMoveDone = true
            }
          }
          self.verifyInfo = data
        }
      }
      captchaIns = new noCaptcha(NCOpt)
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
      let verifyInfo = {
        'session': data.csessionid,
        'token': data.token,
        'sig': data.sig,
        'scene': self.formScene,
        'terminal': 'web'
      }
      if (self.verifyType === 'mobile') {
        // 发送短信验证码
        let formData
        if (this.isBanding) {
          // 绑定手机号
          formData = {
            mobile: this.mobile,
            country_code: this.countryCode,
            verify_info: verifyInfo,
            scene: self.formScene
          }
        } else {
          // 已绑定手机号
          formData = {
            verify_info: verifyInfo,
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
            captchaIns && captchaIns.reload() // 重新初始化滑动验证
          })
      } else {
        // 发送邮箱验证码
        let formData
        if (this.isBanding) {
          // 绑定手机号
          formData = {
            email: this.email,
            verify_info: verifyInfo,
            scene: self.formScene
          }
        } else {
          // 已绑定手机号
          formData = {
            verify_info: verifyInfo,
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
            captchaIns && captchaIns.reload() // 重新初始化滑动验证
          })
      }
    },
    onClose () {
      this.$emit('closeDialogVerifyVisible')
    }
  },
  computed: {
    ...mapGetters({
      'appInfo': 'getAppInfo'
    }),
    appID () {
      return process.env.NODE_ENV === 'development' ? this.appInfo.appID : ALI_VCODE_APPKEY
    }
  }
}
</script>
