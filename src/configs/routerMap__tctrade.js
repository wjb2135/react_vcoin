import Buy from "@pages/tctrade/trade/buy";
import Sell from "@pages/tctrade/trade/sell";
import Order from "@pages/tctrade/orders/order";
import Advertisement from "@pages/tctrade/orders/advertisement";
import Ident from "@pages/tctrade/ident";

export default [
  { path: "/tctrade/", name: "tcTrade", component: Buy },
  { path: "/tctrade/trade/buy", name: "tcTradeBuy", component: Buy },
  { path: "/tctrade/trade/sell", name: "tcTradeSell", component: Sell },
  { path: "/tctrade/orders/order", name: "tcTradeOrder", component: Order, auth: true },
  { path: "/tctrade/orders/advertisement", name: "tcTradeAdvertisement", component: Advertisement, auth: true },
  { path: "/tctrade/ident", name: "tcTradeIdent", component: Ident, auth: true }
];