// DEMO
export const GET_LIST = 'getList'
export const GET_MY_LIST = "getMyList";
export const CHANGE_INPUT = 'changeInput'
export const ADD_ITEM = 'addItem'
export const DELETE_ITEM = 'deleteItem'

// 全局
export const GET_SYS_CONFIG = "getSysConfig"; // 获取系统初始化信息
export const GET_BASE_USERINFO = "getBaseUserInfo"; // 获取登陆用户信息
export const LOGIN_OUT = "loginOut"; // 登出操作

// 验证器
export const SET_VISIBLE_DIALOG_VERIFY = "setVisibleDialogVerify"; // 弹出验证器（滑动 / 拼图）
export const SET_VERIFYTYPE = "setVerifyType"; // 验证类型（手机 / 邮箱）

// 发送邮箱验证码
export const SET_EMAIL_VCODE_SENDING = "setEmailVcodeSending"; // 设置邮箱发送状态
export const SET_LOADING_EMAIL_VCODE_SEND = "setLoadingEmailVcodeSend"; // 设置请求短信接口是否成功
export const RUN_EMAIL_VCODE_LEFT_TIME = "runEmailVcodeLeftTime" // 再次发送验证码倒计时

// 发送短信验证码
export const SET_MOBILE_VCODE_SENDING = "setMobileVcodeSending"; // 设置短信发送状态
export const SET_LOADING_MOBILE_VCODE_SEND = "setLoadingMobileVcodeSend"; // 设置请求短信接口是否成功
export const RUN_MOBILE_VCODE_LEFT_TIME = "runMobileVcodeLeftTime" // 再次发送验证码倒计时

// SAGA
export const SAGA_GET_BASE_USERINFO = "sagaGetBaseUserInfo";
export const SAGA_GET_SYS_CONFIG = "sagaGetSysConfig";
export const SAGA_LOGIN_OUT = "sagaLoginOut";
export const SAGA_RUN_VCODE_LEFT_TIME = "sagaRunVcodeLeftTime";