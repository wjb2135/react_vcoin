import { CHANGE_INPUT, ADD_ITEM, DELETE_ITEM, GET_LIST } from "./actionTypes";

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
export const getList = (data) => ({
  type: GET_LIST,
  data
})

export const getTodoList = () => {
  return async (dispatch) => {
    let res = await axios.post(
      "http://rap2api.taobao.org/app/mock/240569/get_lists"
    );
    const data = res.data.list;
    const action = getList(data);
    dispatch(action);
  };
}