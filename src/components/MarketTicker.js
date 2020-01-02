import React from "react";
import { Tabs, Input, Table } from "antd";
import "@styles/MarketTicker.less";

const { TabPane } = Tabs;
const { Search } = Input;

export default function MarketTicker(props) {
  const { marketList, callback } = props;
  const columns = [
    {
      title: "市场",
      dataIndex: "trade_vcoin_code",
      key: "trade_vcoin_code",
      render: text => <a>{text}</a>
    },
    {
      title: "最新价",
      dataIndex: "price",
      key: "price"
    },
    {
      title: "24h涨幅",
      dataIndex: "increase",
      key: "increase"
    },
    {
      title: "24h最高价",
      dataIndex: "max_price",
      key: "max_price"
    },
    {
      title: "24h最低价",
      dataIndex: "min_price",
      key: "min_price"
    },
    {
      title: "24h成交量",
      dataIndex: "totle",
      key: "totle"
    }
  ];
  return (
    <div className="market-ticker">
      <Search
        placeholder="input search text"
        onSearch={value => console.log(value)}
        style={{ width: 200 }}
        className="input-search"
      />
      <Tabs activeKey="2" onChange={callback} type="card">
        <TabPane tab="自选" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="全部行情" key="2">
          <Table
            columns={columns}
            rowKey={(record, index) => index}
            dataSource={
              (marketList && marketList.length > 0 && marketList[0].list) || []
            }
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
