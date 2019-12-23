import React from 'react';
import { Provider } from "react-redux";
import ReactDOM from 'react-dom';
import store from "./store";
import { BrowserRouter as Router } from "react-router-dom";
import "./server.js";
import './index.css';
import reducers from './redux/reducers'
import Routes from '@configs/router.config'
import Header from "@components/header";
import AppFooter from "@components/AppFooter";
import "./App.css";
import "@styles/variable.less";
import "@styles/resetAnt.less";
import { Layout } from "antd";
const { Footer, Sider, Content } = Layout;

// let store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Layout>
        <Header />
        <Content>
          <Routes />
        </Content>
        <Footer>
          <AppFooter />
        </Footer>
      </Layout>
    </Router>
  </Provider>,
  document.getElementById("root")
);

