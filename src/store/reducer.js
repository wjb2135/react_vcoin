import { CHANGE_INPUT, ADD_ITEM, DELETE_ITEM, GET_LIST, GET_MY_LIST } from './actionTypes'

const defaultState = {
  inputValue: 'input somethingssss',
  list: []
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
  
  return state
}