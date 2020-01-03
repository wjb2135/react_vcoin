import React, { Component } from 'react';
import { connect } from "react-redux";
import { Table, Tabs, Spin } from "antd";
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
    this.callback = this.callback.bind(this)
    this.orderDetail = this.orderDetail.bind(this)
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
  callback(e) {
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
    const columns = [
      {
        title: '订单号',
        dataIndex: 'id',
        render: (text, record, index) => (
          <span style={{ color: '#1d96e3' }} className="name" onClick={self.orderDetail.bind(this, text)}>{text}</span>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'created_at'
      },
      {
        title: '币种',
        dataIndex: 'buy_vcoin_code'
      },
      {
        title: '类型',
        dataIndex: 'sell_user_id',
        render: (text, record, index) => (
          <span>{loginUser.id == record.sell_user_id ? '在线出售' : '在线购买'}</span>
        )
      },
      {
        title: '交易对象',
        dataIndex: 'tradeObject',
        render: (text, record, index) => (
          <span>{loginUser.id == record.buy_user_id ? (record.sell_user && record.sell_user.nickname || '游客') : record.buy_user && record.buy_user.nickname || '游客'}</span>
        )
      },
      {
        title: '交易价格',
        dataIndex: 'buy_price',
        render: (text, record, index) => (
          <span>{text.toFixed(2)} {record.pay_currency_type}</span>
        )
      },
      {
        title: '数量',
        dataIndex: 'buy_count_str'
      },
      {
        title: '金额',
        dataIndex: 'pay_fee',
        render: (text, record, index) => (
          <span>{text} {record.pay_currency_type}</span>
        )
      },
      {
        title: '手续费',
        dataIndex: 'service_fee_str',
        render: (text, record, index) => (
          <span>{loginUser.id == record.goods_detail.user_id ? text : 0}</span>
        )
      },
      {
        title: '参考号',
        dataIndex: 'pay_reference_no'
      },
    ];
    const TableItem = (
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={this.state.list}
      />
    )
    return (
      <div className="order-content">
        <div className="order-tab-nav">
          <Spin spinning={this.state.loading}>
            <Tabs defaultActiveKey="1" animated={false} onChange={this.callback} loading={this.state.loading}>
              <TabPane tab="未付款" key="0">
                {TableItem}
              </TabPane>
              <TabPane tab="已付款" key="1">
                {TableItem}
              </TabPane>
              <TabPane tab="已完成" key="2">
                {TableItem}
              </TabPane>
              <TabPane tab="取消" key="3">
                {TableItem}
              </TabPane>
              <TabPane tab="申述中" key="4">
                {TableItem}
              </TabPane>
            </Tabs>
          </Spin>
        </div>
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    loginUser: state.baseUserInfo
  }
}
 
export default connect(stateToProps, null)(order);