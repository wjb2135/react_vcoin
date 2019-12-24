import React, { Component } from "react";
import { connect } from "react-redux";
import { Input } from "antd";
class TodoListNew extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Input
        placeholder={this.props.inputValue}
        value={this.props.inputValue}
        onChange={this.props.inputChange}
      />
    );
  }
  inputChange(e) {
    console.log(e.target.value);
    
  }
}

const stateToProps = (state) => {
  return {
    inputValue: state.inputValue
  }
}

const dispatchToProps = (dispath) => {
  return {
    inputChange(e) {
      console.log(e.target.value);
      const action = {
        type: "change_input",
        value: e.target.value
      };
      dispath(action);
    }
  }
}

export default connect(stateToProps, dispatchToProps)(TodoListNew);