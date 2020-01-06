import {
  GET_LIST,
  GET_MY_LIST,
  GET_SYS_CONFIG,
  GET_BASE_USERINFO,
  SET_MOBILE_VCODE_SENDING,
  SET_EMAIL_VCODE_SENDING,
  SET_VISIBLE_DIALOG_VERIFY,
  SET_VERIFYTYPE,
  SET_LOADING_MOBILE_VCODE_SEND,
  SAGA_GET_BASE_USERINFO,
  SAGA_GET_SYS_CONFIG,
  SAGA_LOGIN_OUT,
  LOGIN_OUT,
  CHANGE_INPUT,
  ADD_ITEM,
  DELETE_ITEM,
  RUN_MOBILE_VCODE_LEFT_TIME,
  RUN_EMAIL_VCODE_LEFT_TIME,
  SET_VISIBLE_NICKNAME_FORM
} from "./actionTypes";

import axios from 'axios'


export const changeInputAction = (value) => ({
  type: CHANGE_INPUT,
  value
})
export const addItemAction = () => ({
  type: ADD_ITEM
})
export const deleteItemAction = (index) => ({
  type: DELETE_ITEM,
  index
})

export const getListAction = (data) => ({
  type: GET_LIST,
  data
})
export const getTodoList = () => {
  return async (dispatch) => {
    let res = await axios.post(
      "http://rap2api.taobao.org/app/mock/240569/get_lists"
    );
    const data = res.data.list;
    const action = getListAction(data);
    dispatch(action);
  };
}
export const getMyListAction = (data) => ({
  type: GET_MY_LIST,
  data
});
export const getBaseUserInfoAction = (data) => ({
  type: GET_BASE_USERINFO,
  data
})
export const getSysConfigAction = (data) => ({
  type: GET_SYS_CONFIG,
  data
})

export const setMobileVcodeSendingAction = (data) => ({
  type: SET_MOBILE_VCODE_SENDING,
  data
})
export const setEmailVcodeSendingAction = (data) => ({
  type: SET_EMAIL_VCODE_SENDING,
  data
})
export const setVisibleDialogVerifyAction = (data) => ({
  type: SET_VISIBLE_DIALOG_VERIFY,
  data
})
export const setVerifyTypeAction = (data) => ({
  type: SET_VERIFYTYPE,
  data
})
export const setLoadingMobileVcodeSendAction = (data) => ({
  type: SET_LOADING_MOBILE_VCODE_SEND,
  data
})

export const loginOutAction = (data) => ({
  type: LOGIN_OUT,
  data
})
export const runMobileVcodeLeftTimeAction = (data) => ({
  type: RUN_MOBILE_VCODE_LEFT_TIME,
  data
})
export const runEmailVcodeLeftTimeAction = (data) => ({
  type: RUN_EMAIL_VCODE_LEFT_TIME,
  data
})
export const setVisibleNickNameFormAction = (data) => ({
  type: SET_VISIBLE_NICKNAME_FORM,
  data
})

// saga
export const sagaGetBaseUserInfoAction = (data) => ({
  type: SAGA_GET_BASE_USERINFO,
  data
})
export const sagaGetSysConfigAction = (data) => ({
  type: SAGA_GET_SYS_CONFIG,
  data
})
export const sagaLoginOutAction = () => ({
  type: SAGA_LOGIN_OUT
})