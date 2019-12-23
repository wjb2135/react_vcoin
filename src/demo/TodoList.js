import React, { Component } from 'react';
import store from '../store'
import { getTodoList, changeInputAction, addItemAction, deleteItemAction, getList } from '../store/actionCreators'
import TodoListUI from './TodoListUI'
 
class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingList: false,
      st: store.getState()
    }
    this.changeInputValue = this.changeInputValue.bind(this)
    this.storeChange = this.storeChange.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.clickBtn = this.clickBtn.bind(this)
    store.subscribe(this.storeChange)
  }
  render() { 
    return (
      <TodoListUI
        inputValue={this.state.st.inputValue}
        list={this.state.st.list}
        clickBtn={this.clickBtn}
        changeInputValue={this.changeInputValue}
        deleteItem={this.deleteItem}
        loadingList={this.state.loadingList}
      />
     );
  }
  changeInputValue(e) {
    console.log(e.target.value);
    const action = changeInputAction(e.target.value)
    store.dispatch(action)
  }
  clickBtn() {
    const action = addItemAction()
    store.dispatch(action)
  }
  deleteItem(index) {
    const action = deleteItemAction(index)
    store.dispatch(action)
  }
  storeChange() {
    this.setState({
      st: store.getState()
    })
  }
  async componentDidMount() {
    this.setState({
      loadingList: true
    })
    const action = getTodoList();
    store.dispatch(action)
    this.setState({
      loadingList: false
    });
  }
}
 
export default TodoList;