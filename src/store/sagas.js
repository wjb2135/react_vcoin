import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";
import { GET_MY_LIST, SAGA_GET_BASE_USERINFO, SAGA_GET_SYS_CONFIG } from "./actionTypes";
import { getListAction, getBaseUserInfoAction, getSysConfigAction } from "./actionCreators";
import {
  getCookie
} from '@/assets/js/cookieHandle'


function* mySaga(){
  yield takeEvery(GET_MY_LIST, getList)
  yield takeEvery(SAGA_GET_BASE_USERINFO, getBaseLoginUserInfo)
  yield takeEvery(SAGA_GET_SYS_CONFIG, getSysConfig)
}

function* getList() {
  const res = yield axios.post("http://rap2api.taobao.org/app/mock/240569/get_lists")
  const action = getListAction(res.data.list);
  yield put(action)
}

function* getBaseLoginUserInfo() {
  if (!getCookie('_TOKEN')) return
  const res = yield axios.post("/api/get_login_user_info", {
    '_token': getCookie('_TOKEN')
  })
  const action = getBaseUserInfoAction(res.data);
  yield put(action)
}

function* getSysConfig() {
  const res = yield axios.post("/api/system/get_config")
  const action = getSysConfigAction(res.data)
  yield put(action)
}

export default mySaga