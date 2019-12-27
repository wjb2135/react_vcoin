export const CHANGE_INPUT = 'changeInput'
export const ADD_ITEM = 'addItem'
export const DELETE_ITEM = 'deleteItem'
export const GET_LIST = 'getList'
export const GET_MY_LIST = "getMyList";
export const SET_BASE_USERINFO = "setBaseLoginUserInfo";
export const GET_BASE_USERINFO = "getBaseUserInfo";
export const SET_MOBILE_VCODE_SENDING = "setMobileVcodeSending"; // 设置短信发送状态
export const SET_EMAIL_VCODE_SENDING = "setEmailVcodeSending"; // 设置邮箱发送状态
export const GET_SYS_CONFIG = "getSysConfig"; // 获取系统初始化信息
export const LOGIN_OUT = "loginOut"; // 登出操作

// SAGA
export const SAGA_GET_BASE_USERINFO = "sagaGetBaseUserInfo";
export const SAGA_GET_SYS_CONFIG = "sagaGetSysConfig";
export const SAGA_LOGIN_OUT = "sagaLoginOut";