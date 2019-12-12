const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/api", {
      target: "http://api.vcoin2.fx.fanwe.cn",
      changeOrigin: true,
      ws: true, // proxy websockets
      pathRewrite: {
        "^/api": ""
      }
    })
  );

  //app.use(proxy(...)) //可以配置多个代理
};