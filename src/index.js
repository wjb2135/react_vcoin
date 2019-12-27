import React from 'react';
import { Provider } from "react-redux";
import ReactDOM from 'react-dom';
import store from "./store";
import App from './App'
import "./server.js";
import './index.css';

ReactDOM.render(
  // Provider: react-redux 全局state的提供者
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);