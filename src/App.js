import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import "./assets/styles/variable.less";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import Header from "./components/header";
import Routers from "./router/routerMap";
import NotFound from "./components/notFound";
import { connect } from "react-redux";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let token = this.props.token;
    return (
      <Router>
        <div className="App">
          <Header />
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
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { token: state.token };
}

export default connect(mapStateToProps)(App);
