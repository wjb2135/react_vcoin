import Home from "@pages/base/home"; // 首页
import Login from "@pages/base/login"; // 登陆
import Register from "@pages/base/register"; // 登陆
import TradeIndex from "@pages/tctrade"; // 交易
import todoList from "../demo/TodoList";

export default [
  { path: "/", name: "App", component: Home },
  { path: "/home", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/tctrade/", name: "TcTradeIndex", component: TradeIndex, isChild: true },
  { path: "/todolist", name: "todoList", component: todoList }
];