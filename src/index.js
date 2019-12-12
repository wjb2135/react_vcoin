import React from 'react';
import { Provider } from "react-redux";
import ReactDOM from 'react-dom';
import "./server.js";
import './index.css';
import App from './App';
import Index from "./pages/index/index";
import * as serviceWorker from './serviceWorker';

// let store = createStore(todoApp);

// ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(
  <Index />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
