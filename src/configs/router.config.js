import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "@pages/base/home"; // 首页
import TcTradeBuy from "@pages/tctrade/trade/buy"; // 交易

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/tctrade/trade/buy" component={TcTradeBuy} />
    <Route path="/login" component={`@pages/login`} />
  </Switch>
);