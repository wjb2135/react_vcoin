import {
  GET_LIST,
  GET_MY_LIST,
  GET_SYS_CONFIG,
  GET_BASE_USERINFO,
  SET_MOBILE_VCODE_SENDING,
  SET_EMAIL_VCODE_SENDING,
  SET_VISIBLE_DIALOG_VERIFY,
  SET_VERIFYTYPE,
  CHANGE_INPUT,
  ADD_ITEM,
  DELETE_ITEM,
  LOGIN_OUT,
  SET_LOADING_MOBILE_VCODE_SEND,
  RUN_MOBILE_VCODE_LEFT_TIME,
  RUN_EMAIL_VCODE_LEFT_TIME
} from "./actionTypes";

const defaultState = {
  inputValue: 'input somethingssss',
  list: [],
  baseUserInfo: sessionStorage.getItem('baseUserInfo') ? JSON.parse(sessionStorage.getItem('baseUserInfo')) : {},
  systemConfig: {},
  appID: 'FFFF00000000017AAB5E',
  visibleDialogVerify: false,
  verifyType: '',
  mobileLeftTime: 60,
  mobileVcodeSending: false,
  loadingMobileVcodeSend: false
}

export default (state = defaultState, action) => {
  if (action.type === GET_LIST) {
    const newState = JSON.parse(JSON.stringify(state))
    newState.list = action.data
    return newState
  }
  if (action.type === GET_MY_LIST) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.list = action.data;
    return newState;
  }
  if (action.type === GET_SYS_CONFIG) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.systemConfig = action.data;
    return newState;
  }

  if (action.type === GET_BASE_USERINFO) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.baseUserInfo = action.data;
    return newState;
  }

  if (action.type === SET_MOBILE_VCODE_SENDING) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.mobileVcodeSending = action.data;
    return newState;
  }
  if (action.type === SET_EMAIL_VCODE_SENDING) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.emailVcodeSending = action.data;
    return newState;
  }
  if (action.type === SET_VISIBLE_DIALOG_VERIFY) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.visibleDialogVerify = action.data;
    return newState;
  }
  if (action.type === SET_VERIFYTYPE) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.verifyType = action.data;
    return newState;
  }
  if (action.type === SET_VERIFYTYPE) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.verifyType = action.data;
    return newState;
  }
  if (action.type === SET_LOADING_MOBILE_VCODE_SEND) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.loadingMobileVcodeSend = action.data;
    return newState;
  }
  if (action.type === RUN_MOBILE_VCODE_LEFT_TIME) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.mobileLeftTime = action.data;
    return newState;
  }
  if (action.type === RUN_EMAIL_VCODE_LEFT_TIME) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.emailLeftTime = action.data;
    return newState;
  }

  if (action.type === LOGIN_OUT) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.baseUserInfo = {}
    return newState;
  }
  if (action.type === CHANGE_INPUT) {
    const newState = JSON.parse(JSON.stringify(state))
    newState.inputValue = action.value
    return newState
  }
  if (action.type === ADD_ITEM) {
    const newState = JSON.parse(JSON.stringify(state))
    if (newState.inputValue !== '') {
      newState.list.push(newState.inputValue)
      newState.inputValue = ''
    }
    return newState
  }
  if (action.type === DELETE_ITEM) {
    const newState = JSON.parse(JSON.stringify(state))
    console.log(action.index);
    newState.list.splice(action.index, 1)
    return newState
  }

  return state
}