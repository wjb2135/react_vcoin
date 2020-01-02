import React, { Component } from "react"
import io from "socket.io-client"
import UIMarketTicker from "@components/MarketTicker";

let socket = null

export default class MarketTicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseInfoLoading: false,
      marketList: [],
      coinType: "",
      futureMarketList: [],
      baseInfoCatalog: []
    };
  }
  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }
  callback(key) {
    console.log(key);
  }
  /**
   * socket.io 客户端连接
   * @param {string} url 连接地址
   * @param {string} base_coin 基础币
   * @param {string} exchange_coin 非基础币
   */
  socketInit (url, base_coin, exchange_coin) {
    let self = this
    self.setState({
      baseInfoLoading: true
    });
    if (socket) {
      socket.destroy() // 初始化前，销毁上次创建的实例
      socket = null
    }

    // 与服务器进行连接
    socket = io.connect(url)

    // 监听连接成功
    socket.on('connect', () => {
      console.debug('socket连接成功')
    })

    // 监听连接失败
    socket.on('connect_error', (error) => {
      // 尝试重新连接socket
      console.debug(error)
    })

    // 监听断开连接
    socket.on('disconnect', function (msg) {
      console.debug('断开连接')
    })

    socket.on('base_info', function (res) {
      self.setState({
        baseInfoLoading: false
      });
      if (res) {
        let data = JSON.parse(res)
        data.map((item, index) => (
          item.key = index.toString()
        ))
        self.setState({
          marketList: data
        });
        if (
          !self.state.coinType &&
          self.state.marketList &&
          self.state.marketList.length > 0
        ) {
          self.setState({
            coinType: self.state.marketList[0].type
          });
        }
      }
    })
    socket.on('base_info_catalog', function (res) {
      if (res) {
        self.setState({
          baseInfoCatalog: JSON.parse(res)
        });
      }
    })
    socket.on('future_base_info', function (res) {
      if (res) {
        self.setState({
          futureMarketList: JSON.parse(res)
        });
      }
    })
  }
  componentDidMount() {
    this.socketInit('http://47.74.226.235:30031')
  }
  render() {
    return <UIMarketTicker {...this.state} callback={this.callback.bind(this)} />;
  }
}