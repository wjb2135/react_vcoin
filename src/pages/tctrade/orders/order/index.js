import React, { Component } from 'react';
import { connect } from "react-redux";
import { Table, Tabs, Spin } from "antd";
import TctradeOrder from "@components/TctradeOrder";
import '@styles/orderContent.less';
const { TabPane } = Tabs;

class order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeName: 'unpaid',
      loading: true,
      list: [],
      total: 0,
      currencyType: ''
    }
    this.changeOrderType = this.changeOrderType.bind(this)
  }
  componentDidMount() {
    this.getData('0')
  }
  /**
   * 获取未付款数据
   */
  async getData(type, page = 1) {
    let self = this;
    self.setState({
      currencyType: type,
      loading: true
    })
    let res = await self.postRequestParam('/api/fabi/order/my', {
      status: type.toString(),
      page: page,
      rows: 10
    });
    self.setState({
      loading: false,
      list: res.data.data || [],
      total: res.data.total
    })
  }
  changeOrderType(e) {
    this.getData(e)
  }
  /**
   * 查看订单详情
   * @param {Object} item 当前订单
  */
  orderDetail(id) {
    console.log(id)
  }
  render() {
    let self = this
    const { loginUser } = this.props
    return (
      <TctradeOrder {...this.state} {...this.props} orderDetail={this.orderDetail} loginUser={loginUser} changeOrderType={this.changeOrderType}/>
    );
  }
}

const stateToProps = (state) => {
  return {
    loginUser: state.baseUserInfo
  }
}
 
export default connect(stateToProps, null)(order);