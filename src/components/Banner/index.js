import React, { Component } from "react";
import { Carousel, Spin } from "antd";

import '@styles/Banner.less'

export default class Banner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list_banner: [],
      loading: false
    };
  }
  componentDidMount() {
    this.getData();
  }
  async getData() {
    const { APIURL } = this.props;
    this.setState({
      loading: true
    });
    let res = await this.postRequestParam(APIURL);
    this.setState({
      loading: false,
      list_banner: res.data.data
    });
  }
  render() {
    const { loading } = this.state
    const listItem = this.state.list_banner.map((item, index) => (
      <div key={item.id}>
        <img src={item.image} alt="" />
      </div>
    ));
    return (
      <div className="banner">
        {loading ? (
          <Spin />
        ) : (
          <Carousel autoplay>{listItem}</Carousel>
        )}
      </div>
    );
  }
}