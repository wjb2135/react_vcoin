import React, { Component } from "react";
import UIBanner from "@components/Banner";
export default class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAd: [],
      loadingAd: false
    };
  }
  async componentDidMount() {
    // 获取广告列表
    this.setState({
      loadingAd: true
    });
    let res = await this.postRequestParam(`/api/ad/index`);
    this.setState({
      loadingAd: false,
      listAd: res.data
    });
  }
  render() {
    return <UIBanner {...this.state} />;
  }
}
