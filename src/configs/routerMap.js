import todoList from "../demo/TodoList";

import Home from "@pages/base/home"; // 首页
import Login from "@pages/base/login"; // 登陆
import Register from "@pages/base/register"; // 登陆
import TradeIndex from "@pages/tctrade"; // 交易
import UserCenter from "@pages/uc"; // 交易
import Forget from "@/pages/base/forget"; // 忘记密码

export default [
  { path: "/", name: "App", component: Home },
  { path: "/home", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/tctrade/", name: "TcTradeIndex", component: TradeIndex, isChild: true },
  { path: "/uc/", name: "UserCenter", component: UserCenter, isChild: true },
  { path: "/todolist", name: "todoList", component: todoList },
  { path: "/forget", name: "Forget", component: Forget }
];