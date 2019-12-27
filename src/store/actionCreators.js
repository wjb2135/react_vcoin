import {
  GET_MY_LIST,
  CHANGE_INPUT,
  ADD_ITEM,
  DELETE_ITEM,
  GET_LIST,
  SET_BASE_USERINFO,
  GET_BASE_USERINFO,
  SAGA_GET_BASE_USERINFO,
  SET_MOBILE_VCODE_SENDING,
  SET_EMAIL_VCODE_SENDING,
  GET_SYS_CONFIG,
  LOGIN_OUT,
  SAGA_GET_SYS_CONFIG,
  SAGA_LOGIN_OUT
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

export const setMobileVcodeSendingAction = (data) => ({
  type: SET_MOBILE_VCODE_SENDING,
  data
})

export const setEmailVcodeSendingAction = (data) => ({
  type: SET_EMAIL_VCODE_SENDING,
  data
})

export const getSysConfigAction = (data) => ({
  type: GET_SYS_CONFIG,
  data
})
export const loginOutAction = (data) => ({
  type: LOGIN_OUT,
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