import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Redirect } from "react-router-dom";
import Header from "./components/header/index";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div className="App">{Header}</div>
  }
}
export default App;
