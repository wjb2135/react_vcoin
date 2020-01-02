import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { connect } from "react-redux";
import { sagaGetSysConfigAction } from '@/store/actionCreators';
import { getCookie } from '@/assets/js/cookieHandle'
import { Layout } from "antd";

import Routers from "@configs/routerMap";
import AppHeader from "@components/header";
import AppFooter from "@components/AppFooter";
import NotFound from "./components/notFound";

import "./App.css";
import "@styles/variable.less";
import "@styles/resetAnt.less";

const { Footer, Content } = Layout;

class App extends Component {
  componentDidMount() {
    this.props.getSysConfig()
  }
  render() {
    let token = getCookie('_TOKEN')
    return (
      <Router>
        <Layout>
          <AppHeader />
          <Content>
            <Switch>
              {Routers.map((item, index) => {
                return <Route key={index} path={item.path} exact render={props =>
                  (!item.auth ? (<item.component {...props} />) : (token ? <item.component {...props} /> : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                  }} />)
                  )} />
              })}
              <Route component={NotFound} />
            </Switch>
          </Content>
          <Footer>
            <AppFooter />
          </Footer>
        </Layout>
      </Router>
    )
  }
}

const dispatchToProps = (dispatch) => {
  return {
    getSysConfig() {
      const action = sagaGetSysConfigAction()
      dispatch(action)
    }
  }
}

export default connect(null, dispatchToProps)(App);
