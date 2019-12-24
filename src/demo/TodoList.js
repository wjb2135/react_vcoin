import React, { Component } from 'react';
import {
  getMyListAction,
  addItemAction,
  deleteItemAction,
  changeInputAction
} from "../store/actionCreators";
import TodoListUI from './TodoListUI'
import { connect } from "react-redux";

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingList: false
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    return true
  }
  componentWillUpdate() {
    console.log('componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('componentDidUpdate');
  }
  render() {
    console.log('render');
    
    const { inputValue, list, addItem, inputChange, deleteItem } = this.props;
    return (
      <TodoListUI
        inputValue={inputValue}
        list={list}
        addItem={addItem}
        inputChange={inputChange}
        deleteItem={deleteItem}
        loadingList={this.state.loadingList}
      />
    );
  }
  componentDidMount() {
    this.props.getList()
  }
}

const stateToProp = (state) => {
  return {
    inputValue: state.inputValue,
    list: state.list
  }
}

const dispatchToProp = (dispatch) => {
  return {
    getList() {
      const action = getMyListAction();
      dispatch(action);
    },
    inputChange(e) {
      let action = changeInputAction(e.target.value);
      dispatch(action);
    },
    addItem() {
      const action = addItemAction();
      dispatch(action);
    },
    deleteItem(index) {
      let action = deleteItemAction(index);
      dispatch(action);
    }
  };
}
 
export default connect(stateToProp, dispatchToProp)(TodoList);  // react-redux 连接器