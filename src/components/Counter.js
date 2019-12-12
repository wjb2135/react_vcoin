import React, { Component } from 'react'
import { Table, Layout   } from "antd";
import "@styles/InputNumber.less";

const { Header, Content, Footer } = Layout;
export default class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderData: [
        {
          key: 1,
          desc: "波西米亚蛋糕: 波西米亚蛋糕蛋糕",
          num: 1,
          price: 18.8
        }
      ]
    }
    this.onClickIncrementButton = this.onClickIncrementButton.bind(this)
    this.onClickMinusButton = this.onClickMinusButton.bind(this);
  }
  onClickIncrementButton(key) {
    let orderData = this.state.orderData;
    orderData.forEach((item) => {
      if (item.key == key) {
        item.num = item.num + 1;
      }
    })
    this.setState({
      orderData: orderData
    });
  }
  onClickMinusButton(key) {
    let orderData = this.state.orderData;
    orderData.forEach((item) => {
      if (item.key == key) {
        if (item.num == 1) return
        item.num = item.num - 1;
      }
    })
    this.setState({
      orderData: orderData
    });
  }
  render() {
    const trItems = this.state.orderData.map((item, index) => {
      return (
        <tr key={item.key}>
          <td>{item.desc}</td>
          <td>{item.price}</td>
          <td>
            <div className="input-number">
              <span
                className="minus-btn"
                onClick={this.onClickMinusButton.bind(this, item.key)}
              >
                -
              </span>
              <span className="text">{item.num}</span>
              <span
                className="plus-btn"
                onClick={this.onClickIncrementButton.bind(this, item.key)}
              >
                +
              </span>
            </div>
          </td>
          <td>{(item.price * item.num).toFixed(2)}</td>
        </tr>
      );
    });
    return (
      <Content style={{ padding: "0 50px" }}>
        <div className="counter">
          <table className="table">
            <tbody>
              <tr>
                <th>项目</th>
                <th>价格</th>
                <th>数量</th>
                <th>总价</th>
              </tr>
              {trItems}
            </tbody>
          </table>
        </div>
      </Content>
    );
  }
}