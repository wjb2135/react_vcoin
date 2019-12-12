import Home from "../pages/home/index";
import TcTradeBuy from "../pages/tctrade/trade/buy/index";

export default [
  { path: "/", name: "Home", component: Home },
  { path: "/home", name: "Home", component: Home },
  { path: "/tctrade/trade/buy", name: "TcTradeBuy", component: TcTradeBuy }
];