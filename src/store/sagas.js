import { takeEvery, put } from "redux-saga/effects";
import { GET_MY_LIST } from "./actionTypes";
import axios from "axios";
import { getListAction } from "./actionCreators";

function* mySaga(){
  yield takeEvery(GET_MY_LIST, getList)
}

function* getList() {
  const res = yield axios.post("http://rap2api.taobao.org/app/mock/240569/get_lists")
  const action = getListAction(res.data.list);
  yield put(action)
}

export default mySaga