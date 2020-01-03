import React, { Component } from 'react';
import { connect } from "react-redux";
import { Table, Icon, Button } from "antd";
import { getBaseUserInfoAction } from "@/store/actionCreators";
import io from "socket.io-client";
import { IconFont } from "@js/common";

let socket = null
const columns = [
  {
    title: '商家（成单数|完成率）',
    dataIndex: 'user',
    render: (text, record, index) => {
      return (
        <div className="name">
          <span className="business">{text.nickname || '游客'}</span>
          <span>{text.month_trade_succ_count}</span>
          <span> | {((text.trade_succ2_count / text.trade_count || 0) * 100).toFixed(0)}%</span>
          {
            text.is_certified_seller && (
              <img src={this.state.identImg} alt="icon-vip" />
            )
          }
        </div>
      )
    }
  },
  {
    title: '数量',
    dataIndex: 'usable_count_str',
    render: (text, record, index) => {
      return `${text} ${record.vcoin_code}`
    }
  },
  {
    title: '价格',
    dataIndex: 'price_str',
    render: (text, record, index) => {
      return `${text} ${record.currency_type}`
    }
  },
  {
    title: '限额',
    dataIndex: 'min_money',
    render: (text, record, index) => {
      return `${text} - ${record.max_money} ${record.currency_type}`
    }
  },
  {
    title: '货币类型',
    dataIndex: 'currency_type',
    render: (text, record, index) => {
      return (
        <div className="price-btc">
          <div className="price1">{text}</div>
        </div>
      )
    }
  },
  {
    title: '支付方式',
    dataIndex: 'pay',
    render: (text, record, index) => {
      return (
        <div className="pay">
          {
            text.alipay_info && text.alipay_info.visible && (<IconFont type="icon-zhifubao" />)
          }
          {
            text.wxpay_info && text.wxpay_info.visible && (<IconFont type="icon-weixinzhifu" />)
          }
          {
            text.bank_info && text.bank_info.visible && (<IconFont type="icon-yinhangqiazhifu" />)
          }
          {
            text.custompay_info && text.custompay_info.visible && (<IconFont type="icon-zidingyi" />)
          }
        </div>
      )
    }
  },
  {
    title: '操作',
    dataIndex: 'caozuo',
    render: (text, record, index) => {
      return (
        <Button type="primary">买入</Button>
      )
    }
  },
];

class TcTradeBuy extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      radio: "0",
      identImg: require("@/assets/images/icon-vip.png"),
      isOrderDetailPopup: false,
      isNickNamePopup: false,
      isRealNameIdentPopup: false,
      checkboxStatus: false,
      activeTradeName: "normal",
      activeName: "", // tab栏默认值
      checkedSeller: false, // 复选框-商家
      checkedOnLine: false, // 复选框-在线
      dataList: "",
      second: 0,
      showTime: "",
      aSingleData: "",
      id: "",
      loading: true,
      minPrice: "",
      choiceMoney: 0,
      choiceMoneyVal: "全额搜索",
      onLineStatus: 0,
      identStatus: 0,
      orderId: "",
      total: 0,
      searchText: "",
      timeLimit: "",
      ticket: "",
      tableLoading: false,
      setNickNameLoading: false, // 修改昵称操作中
      fabiBasicCoins:
        JSON.parse(sessionStorage.getItem("fabiBasicCoins")) || [],
      socket: null,
      currencyType: "全部币种", // 当前选中的法币币种
      currencyTypesList: "", // 法币币种列表
      ticketCurrencyType: ""
    };
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  async componentDidMount() {
    const { baseLoginUserInfo, getBaseUserInfo } = this.props
    this.getCurrencyTypes();
    this.initSocket();
    let res = await this.postRequestParam(`/api/fabi/symbols/basic_coins`)
    this.setState({
      fabiBasicCoins: res.data
    })
    sessionStorage.setItem('fabiBasicCoins', JSON.stringify(res.data))
    this.init()
    // if (baseLoginUserInfo && baseLoginUserInfo.id) {
    //   let resUserInfo = await this.postRequestParam(`/api/get_login_user_info`)
    //   getBaseUserInfo(resUserInfo.data)
    //   sessionStorage.setItem('baseLoginUserInfo', JSON.stringify(resUserInfo.data))
    // }
  }
  /**
   * 获取法币币种列表
   */
  async getCurrencyTypes () {
    let res = await this.postRequestParam(`/api/fabi/get_currency_types`)
    this.setState({
      currencyTypesList: res.data
    });
  }
  /**
   * socket连接
   */
  initSocket () {
    let self = this
    if (socket) {
      socket.destroy() // 初始化前，销毁上次创建的实例
      socket = null
    }
    self.setState({
      tableLoading: true
    });
    // 与服务器进行连接
    socket = io.connect('http://47.74.226.235:30031')

    // 监听连接成功
    socket.on('connect', () => {
      console.debug('socket连接成功')
      // self.catcherHandlerReady();
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

    // 监听断开连接，重新连接
    socket.on('onclose', function (msg) {
      console.debug('断网或者连接超时')
      socket = io.connect(self._WSHOST)
    })

    socket.on('fabi_info', function (res) {
      console.log('fabi_info')
      console.log(res.sell)
      self.setState({
        loading: false,
        tableLoading: false
      })
      if (res) {
        self.setState({
          dataList: res.sell,
          newDataList: this.getNewDataList(res.sell)
        })
      }
    })
  }
  /**
   * 初始化
   */
  init() {
    const { fabiBasicCoins } = this.state
    if (fabiBasicCoins && fabiBasicCoins.length > 0) {
      if (this.props.location && this.props.location.query && !this.props.location.query.code) {
        this.setState({
          activeName: '0'
        })
        this.joinFabiRoom(fabiBasicCoins[0].code)
      } else {
        for (let i = 0; i < fabiBasicCoins.length; i++) {
          if (this.props.location && this.props.location.query && this.props.location.query.code == fabiBasicCoins[i].code) {
            this.setState({
              activeName: i + ''
            })
            this.joinFabiRoom(this.$route.query.code)
            return false
          } else {
            this.setState({
              activeName: '100'
            })
          }
        }
      }
    }
  }
  /**
   * 加入房间
   * @param {string} base_coin 基础币
   */
  joinFabiRoom (base_coin) {
    console.log('joinFabiRoom');
    console.log(base_coin);
    
    let self = this
    self.setState({
      tableLoading: true
    })
    if (socket) {
      socket.emit('join_fabi_room', `${base_coin.toLowerCase()}`)
    }
  }
  getNewDataList(dataList) {
    // 列表数据查询过滤
    if (dataList && dataList.length > 0) {
      let arr = dataList
      dataList.forEach((val, index, arr) => {
        // 过滤不是商家认证
        if (this.identStatus == 1 && val.user.is_certified_seller == 0) {
          console.log(index)

          arr.splice(index, 1)
        }
        // 过滤不在线
        if (this.onLineStatus == 1 && val.user.is_online == 0) {
          arr.splice(index, 1)
        }
        // 过滤不在价格范围
        if (this.choiceMoney > 0 && (this.choiceMoney > parseFloat(val.price_str))) {
          arr.splice(index, 1)
        }
      })
      return arr
    } else {
      return []
    }
  }
  render() {
    console.log(this.state.newDataList)
    return (
      <div>
        <Table
          columns={columns}
          rowKey={record => record.login.uuid}
          dataSource={this.state.newDataList}
        />
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    baseLoginUserInfo: state.baseUserInfo
  }
}
const dispatchToProps = (dispatch) => {
  return {
    getBaseUserInfo() {
      const action = getBaseUserInfoAction()
      dispatch(action)
    }
  }
}
export default connect(stateToProps, dispatchToProps)(TcTradeBuy)