import {
  CHANGE_INPUT,
  ADD_ITEM,
  DELETE_ITEM,
  GET_LIST,
  GET_MY_LIST,
  GET_BASE_USERINFO,
  SET_MOBILE_VCODE_SENDING,
  SET_EMAIL_VCODE_SENDING,
  GET_SYS_CONFIG,
  LOGIN_OUT
} from "./actionTypes";

const defaultState = {
  inputValue: 'input somethingssss',
  list: [],
  baseUserInfo: sessionStorage.getItem('baseUserInfo') ? JSON.parse(sessionStorage.getItem('baseUserInfo')) : {},
  mobileVcodeSending: false,
  systemConfig: {}
}

export default (state = defaultState, action) => {
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

  if (action.type === GET_BASE_USERINFO) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.baseUserInfo = action.data;
    return newState;
  }

  // 设置短信发送状态
  if (action.type === SET_MOBILE_VCODE_SENDING) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.mobileVcodeSending = action.data;
    return newState;
  }
  
  // 设置邮箱发送状态
  if (action.type === SET_EMAIL_VCODE_SENDING) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.emailVcodeSending = action.data;
    return newState;
  }

  if (action.type === GET_SYS_CONFIG) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.systemConfig = action.data;
    return newState;
  }

  if (action.type === LOGIN_OUT) {
    console.log(1123334);
    
    const newState = JSON.parse(JSON.stringify(state));
    newState.baseUserInfo = {}
    return newState;
  }

  return state
}