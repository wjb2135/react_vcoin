import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "@pages/base/home"; // 首页
import Login from "@pages/base/login"; // 登陆
import Register from "@pages/base/register"; // 登陆
import TcTradeBuy from "@pages/tctrade/trade/buy"; // 交易
import todoList from "../demo/TodoList"; // 交易
import todoListNew from "../demo/TodoListNew"; // 交易

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/tctrade/trade/buy" component={TcTradeBuy} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/demo/todoList" component={todoList} />
    <Route path="/demo/todoListNew" component={todoListNew} />
  </Switch>
);